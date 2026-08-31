import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
      
        const { userId } = req.auth();

        if (!userId) {
            return res.json({
                success: false,
                message: "User is not authenticated"
            });
        }

        const user = await User.findById(userId);

      

        if (!user) {
            return res.json({
                success: false,
                message: "User not found in database"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("PROTECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};