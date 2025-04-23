import { NextFunction, Response } from "express";
import ConversationService from "../services/conversation.service";
import { AuthenticatedRequest } from "../middlewares/authenticate.middleware";
import { successResponse } from "../types/ApiResponse";
import { createConversationSchema, getMessagesSchema } from "../validators/conversation-schema";
import MessageService from "../services/message.service";

class ConversationController {
    private conversationService: ConversationService; // Replace with actual type
    private messageService: MessageService; // Replace with actual type
    constructor({ conversationService, messageService }: { conversationService: ConversationService, messageService: MessageService }) {
        this.messageService = messageService
        this.conversationService = conversationService; // Replace with actual type
    }

    getConversation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const conversation = await this.conversationService.getConversation(req.user!.id, {
                conversationId:
                    req.params.conversationId
            });
            res.status(200).json(successResponse("Get conversation successfully", conversation));
        } catch (error: any) {
            next(error)
        }
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

    getMessagesOfConversation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const rawData = {
                conversationId: req.params.conversationId,
                ...req.query
            }
            await getMessagesSchema.validateAsync(rawData)

            const data = {
                conversationId: req.params.conversationId,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
            }
            const response = await this.conversationService.getMessagesOfConversation(req.user!.id, data);
            res.status(200).json(successResponse(
                "Get messages successfully",
                response.data,
                response.limit,
                response.page,
                response.totalPages,
            ));
        } catch (error: any) {
            next(error)
        }
    }


    deleteMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = {
                messageId: req.params.messageId
            }
            await this.messageService.deleteMessage(req.user!.id, data)
            res.status(200).send(successResponse("Delete message successfully"))
        } catch (error) {
            next(error)
        }
    }
}

export default ConversationController;