import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDb = async () => {
    try {
        console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ mongodb connected");

    } catch (error) {
        console.log("❌ MongoDB connection error:", error.message);
    }
};

export default connectDb;