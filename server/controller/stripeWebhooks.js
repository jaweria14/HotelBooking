import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhooks
export const stripeWebhooks = async (request, response) => {

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log("✅ Webhook received");
        console.log("Event type:", event.type);

    } catch (err) {

        console.log("❌ Webhook Error:", err.message);

        return response.status(400).send(
            `Webhook Error: ${err.message}`
        );
    }

    if (event.type === "payment_intent.succeeded") {

        const paymentIntent = event.data.object;

        console.log("✅ Payment successful");
        console.log("Payment Intent ID:", paymentIntent.id);

        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntent.id,
        });

        console.log("Session:", session.data[0]);

        if (!session.data.length) {
            return response.status(400).send("Session not found");
        }

        const { bookingId } = session.data[0].metadata;

        console.log("Booking ID:", bookingId);

        await Booking.findByIdAndUpdate(
            bookingId,
            {
                isPaid: true,
                paymentMethod: "Stripe",
            }
        );

        console.log("✅ Booking marked as paid");
    }

    response.json({ received: true });
};