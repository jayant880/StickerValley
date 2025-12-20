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

            if (validatedData.body) req.body = validatedData.body;

            if (validatedData.query) {
                try {
                    (req as any).query = validatedData.query;
                } catch (e) {
                    Object.keys(req.query).forEach((key) => delete (req.query as any)[key]);
                    Object.assign(req.query, validatedData.query);
                }
            }

            if (validatedData.params) {
                try {
                    (req as any).params = validatedData.params;
                } catch (e) {
                    Object.keys(req.params).forEach((key) => delete (req.params as any)[key]);
                    Object.assign(req.params, validatedData.params);
                }
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.issues.map((issue) => ({
                        path: issue.path.join("."),
                        message: issue.message,
                    })),
                });
            }
            next(error);
        }
    };
