import { NextFunction, Response } from "express";
import ConversationService from "../services/conversation.service";
import { AuthenticatedRequest } from "../middlewares/authenticate.middleware";
import { successResponse } from "../types/ApiResponse";
import { createConversationSchema } from "../validators/conversation-schema";

class ConversationController {
    private conversationService: ConversationService; // Replace with actual type

    constructor({ conversationService }: { conversationService: ConversationService }) {

        this.conversationService = conversationService; // Replace with actual type
    }

    getConversations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const conversations = await this.conversationService.getConversations(req.user!.id);
            res.status(200).json(successResponse("Get conversations successfully", conversations));
        } catch (error: any) {
            next(error)
        }
    }

    createConversation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            await createConversationSchema.validateAsync(req.body);
            const conversation = await this.conversationService.createConversation(req.user!.id, req.body);
            res.status(201).json(successResponse("Create conversation successfully", conversation));
        } catch (error: any) {
            next(error)
        }
    }

}

export default ConversationController;