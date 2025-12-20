import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

export const validate =
    (schema: ZodType<any>) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            req.body = validatedData.body;
            req.query = validatedData.query;
            req.params = validatedData.params;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.issues.map((issue) => ({
                        path: issue.path.slice(1).join("."),
                        message: issue.message,
                    })),
                });
            }
            next(error);
        }
    };
