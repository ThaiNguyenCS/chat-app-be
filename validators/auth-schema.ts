import joi from 'joi';
export const registerSchema = joi.object({
    phoneNumber: joi.string().pattern(/^[0-9]{10}$/).required(),
    password: joi.string().min(8).max(20).required(),
})