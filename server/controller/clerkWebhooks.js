import User from '../models/User.js'
import { Webhook } from 'svix'

const clerkWebhooks = async (req, res) => {
    try {
        //create svix instance with the clerk web hook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //getting headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verifying Headers
        await whook.verify(JSON.stringify(req.body), headers);

        // Getting Data from request body
        const { data, type } = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address, // yahan theek kiya
            username: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            image: data.image_url
        };

        //switch cases for different events
        switch (type) {
            case "user.created": {
                await User.create(userData);
                break;
            }
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;
        }
        res.json({success: true, message: "WebHook received"})

    } catch (error) { // err ki jaga error
        console.log(error.message)
        res.status(400).json({success: false, message: error.message});
    }
}

export default clerkWebhooks;