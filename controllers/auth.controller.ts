import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
import { registerSchema } from "../validators/auth-schema";
import { successResponse } from "../types/ApiResponse";
import { toAuthDTO } from "../dto/auth.dto";

class AuthController {
    private authService: AuthService;
    constructor({ authService }: { authService: AuthService }) {
        this.authService = authService;
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await registerSchema.validateAsync(req.body)
            const { phoneNumber, password } = req.body;
            const token = await this.authService.login({ phoneNumber, password });
            res.status(200).json(successResponse("User logined successfully", token));
        } catch (error) {
            next(error)
        }
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await registerSchema.validateAsync(req.body)
            const { phoneNumber, password } = req.body;
            const user = await this.authService.register({ phoneNumber, password });
            res.status(201).json(successResponse("User registered successfully", toAuthDTO(user)));
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController;