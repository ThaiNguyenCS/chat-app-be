import AppError from "./AppError";
import { NextFunction, Request, Response } from "express";
import type { ErrorRequestHandler } from "express";
import { errorResponse } from "../types/ApiResponse";
import logger from "../logger/logger";

const globalErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let status = 500
    let message = "Unknown error"
    if (err instanceof AppError) {
        status = err.statusCode
        message = err.message
    }
    // JOI errors 
    if (err.isJoi) {
        status = 400
        message = err.details[0].message
    }
    // res.status(status).send(errorResponse(message, err));
    logger.error(err)
    res.status(status).json(errorResponse(message, err));
}

export default globalErrorHandler