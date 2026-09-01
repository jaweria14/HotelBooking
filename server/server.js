import express from "express";
import "dotenv/config"
import cors from 'cors' ;
import connectDb from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controller/clerkWebhooks.js";
import userRouter from "./routes/userRoute.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import {stripeWebhooks} from "./controller/stripeWebhooks.js";

connectDb() ;
connectCloudinary();
const app= express();

app.use(cors());  //enable cors origin resource sharing
//api to listen to web hook 
app.post('/api/stripe', express.raw({type: "application/json"}),stripeWebhooks);
// middleware 
app.use(express.json())
app.use(clerkMiddleware())

//api to listen to cerk webhhook
app.use('/api/clerk', clerkWebhooks);
app.get('/' ,(req,res)=>{
    res.send("Api is working fine ok  ")
})
//route for the users
app.use('/api/user',userRouter)
//route fo rteh hotel
app.use('/api/hotels',hotelRouter)
//routes for the rooms
app.use('/api/rooms' ,roomRouter)
// route fo rthe booking 
app.use('/api/bookings' ,bookingRouter)

const Port =process.env.PORT || 3000;
app.listen(Port , ()=>{
    console.log(`Server started at the port ${Port} `)
})

