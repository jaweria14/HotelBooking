import express from "express";
import "dotenv/config"
import cors from 'cors' ;
import connectDb from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controller/clerkWebhooks.js";

connectDb() ;
const app= express();

app.use(cors());  //enable cors origin resource sharing
// middleware 
app.use(express.json())
app.use(clerkMiddleware())

//api to listen to cerk webhhook
app.use('/api/clerk', clerkWebhooks);
app.get('/' ,(req,res)=>{
    res.send("Api is working fine ok  ")
})
const Port =process.env.PORT || 3000;
app.listen(Port , ()=>{
    console.log(`Server started at the port ${Port} `)
})

