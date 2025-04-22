import Joi from "joi";

export const messageSchema = Joi.object({
    conversationId: Joi.string().required(),
    content: Joi.string().required(),
    mediaUrl: Joi.string(),
})


export const seenSchema = Joi.object({
    conversationId: Joi.string().required(),
    timestamp: Joi.date().required()
})