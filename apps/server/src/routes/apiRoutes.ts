import express from 'express';
import { requireAuth, getAuth } from "@clerk/express";
import { getOrSyncUser } from '../services/userService';

const router = express.Router();

router.get('/protected', requireAuth(), async (req, res) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }

    try {
        const user = await getOrSyncUser(userId);

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        res.json({
            message: "Protected route accessed",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
