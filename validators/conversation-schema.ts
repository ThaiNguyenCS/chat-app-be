import Joi from "joi";

export const createConversationSchema = Joi.object({
    userIds: Joi.array().items(Joi.string()).min(1).required(),
    name: Joi.string().min(1).max(100).required(),
})

export const getMessagesSchema = Joi.object({
    conversationId: Joi.string().required(),
    limit: Joi.number().positive(),
    page: Joi.number().min(1),
})