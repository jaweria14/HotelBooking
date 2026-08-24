import mongoose, { mongo } from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);


const connectDb= async()=>{
   try{
      console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);
    mongoose.connection.on('connected' ,()=>{
        console.log('mongodb connected')
    })
     await mongoose.connect(`${process.env.MONGODB_URI}`)
   }
   catch(error){
    console.log(error.message)
   }
}

export default connectDb;