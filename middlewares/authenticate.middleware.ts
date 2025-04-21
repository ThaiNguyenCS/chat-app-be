import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/config";
import { CustomJwtPayload } from "../types/CustomJwtPayload";
import logger from "../logger/logger";
import { errorResponse } from "../types/ApiResponse";

export interface AuthenticatedRequest extends Request {
    user?: CustomJwtPayload;
}

export const validateTokenMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1]; // discard the part Bearer
    if (!token) {
        res.status(401).json(errorResponse("No token provided"));
    } else {
        try {
            const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as CustomJwtPayload;
            req.user = decoded;
            logger.info("req.user", req.user);
            next();
        } catch (error) {
            res.status(401).json(errorResponse("Invalid token", error));
        }
    }
};
