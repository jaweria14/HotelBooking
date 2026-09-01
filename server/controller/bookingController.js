import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import transporter from "../config/nodemailer.js";
import stripe from "stripe";


// Function to Check Availability of Room

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;

    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

// API to check availability of room
// POST /api/bookings/check-availability

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room
    });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// API to create a new booking
// POST /api/bookings/create

export const createBooking = async (req, res) => {
  try {
    const userId = req.auth().userId;

    const { room, checkInDate, checkOutDate, guests } = req.body;

    // Check if room is available
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Room is not available",
      });
    }

    // Get room details
    const roomData = await Room.findById(room).populate("hotel");

    if (!roomData) {
      return res.json({
        success: false,
        message: "Room not found",
      });
    }

    // Calculate nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const timeDifference =
      checkOut.getTime() - checkIn.getTime();

    const nights = Math.ceil(
      timeDifference / (1000 * 60 * 60 * 24)
    );

    // Calculate total price
    const totalPrice = roomData.pricePerNight * nights;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // Send email
    try {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: req.user.email,
        subject: "Hotel Booking Details",
        html: `
          <h2>Your Booking Details</h2>

          <p>Dear ${req.user.username},</p>

          <p>Thank you for your booking! Here are your details:</p>

          <ul>
            <li>
              <strong>Booking ID:</strong>
              ${booking._id}
            </li>

            <li>
              <strong>Hotel Name:</strong>
              ${roomData.hotel.name}
            </li>

            <li>
              <strong>Location:</strong>
              ${roomData.hotel.address}
            </li>

            <li>
              <strong>Check-In:</strong>
              ${booking.checkInDate.toDateString()}
            </li>

            <li>
              <strong>Check-Out:</strong>
              ${booking.checkOutDate.toDateString()}
            </li>

            <li>
              <strong>Booking Amount:</strong>
              ${process.env.CURRENCY || "$"} ${booking.totalPrice}
            </li>
          </ul>

          <p>We look forward to welcoming you!</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      console.log("Booking email sent successfully");

    } catch (emailError) {
      console.log("EMAIL ERROR:", emailError.message);
    }

    // IMPORTANT:
    // Email fail hone ke bawajood booking successful hai
    return res.json({
      success: true,
      message: "Booking created successfully",
    });

  } catch (error) {
    console.log("BOOKING ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};
// GET /api/bookings/user

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;

    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};


export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth().userId });

    if (!hotel) {
      return res.json({
        success: false,
        message: "No Hotel found"
      });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    // Total Bookings
    const totalBookings = bookings.length;

    // Total Revenue
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings
      }
    });

  } catch (error) {
    res.json({
      success: false,
      message: "failed to fetch the bookings"
    });
  }
};

export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    const roomData = await Room.findById(booking.room).populate('hotel');
    const totalPrice = booking.totalPrice;
    const { origin } = req.headers;

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: roomData.hotel.name,
          },
          unit_amount: totalPrice * 100
        },
        quantity: 1,
      }
    ]
    // Create Checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId,
      }
    })
    res.json({ success: true, url: session.url })

  } catch (error) {
     res.json({success:false , message: "Payment failed"})
  }
}