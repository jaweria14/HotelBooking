import User from '../models/User'
import { Webhook } from 'svix'

const clerkWebhooks = async () => {
    try {
        //create svix insatnce wiith the clerk web hook
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        //gettting headers
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
            email: data.email_addresses[0].email_addresses,
            username: data.first_name + " " + data.last_name,
            image: data.image_url
        };

        //switch cases for diffent events
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
        res.json({success:true, message: "WebHook received"})
    }
    catch (err) {
        console.log(error.message)
          res.json({success:false, message: error.message});
    }
}

export default clerkWebhooks;