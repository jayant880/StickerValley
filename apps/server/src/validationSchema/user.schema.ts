import { z } from "zod";

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters long").max(50, "Name is too long")
    })
});
