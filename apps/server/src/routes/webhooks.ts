import express from 'express';
import { verifyWebhook } from '@clerk/express/webhooks';
import { handleUserToDatabase } from '../webhooks/clerk';

const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const evt = await verifyWebhook(req);
        const { id } = evt.data;
        const eventType = evt.type;
        console.log(`Recived webhook with ID ${id} and event type of ${eventType}`);

        if (evt.type === 'user.created' || evt.type === 'user.updated') {
            await handleUserToDatabase(evt.data);
        }
        return res.send("Webhook received successfully");
    } catch (error) {
        console.error("Error verifying webhook", error);
        return res.status(500).send("Error verifying webhook");
    }
});

export default router;
