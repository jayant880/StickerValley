import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.statusCode === 500) {
        console.error('ERROR 💥:', err);
    }

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message
    });
};