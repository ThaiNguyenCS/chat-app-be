import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticate.middleware";
import UserService from "../services/user.service";
import { successResponse } from "../types/ApiResponse";
import { createProfileSchema } from "../validators/user-schema";

class UserController {
    private userService: UserService;
    constructor({ userService }: { userService: UserService }) {
        this.userService = userService;
    }

    createProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            await createProfileSchema.validateAsync(req.body);
            const profile = await this.userService.createProfile(req.user!.id, req.body);
            res.status(201).json(successResponse("Profile created successfully", profile));
        } catch (error) {
            next(error);
        }
    }

    updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
        } catch (error) {
            next(error);
        }
    }

}
export default UserController