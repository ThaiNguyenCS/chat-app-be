import Joi from "joi";
import { SEX } from "../models/User.model";

export const createProfileSchema = Joi.object({
    lastName: Joi.string().min(1).optional(),
    firstName: Joi.string().min(1).required(),
    email: Joi.string().email().optional(),
    displayName: Joi.string().min(1).optional(),
    selfDescription: Joi.string().optional(),
    sex: Joi.string().valid(...Object.values(SEX)).required(),
    dob: Joi.date().iso().less("now").required(),
})