import { Router } from 'express';
import { validateTokenMiddleware } from '../middlewares/authenticate.middleware';
import { conversationController } from '../config/container';
const conversationRouter = Router();

conversationRouter.delete("/:conversationId/messages/:messageId", validateTokenMiddleware, conversationController.deleteMessage)
conversationRouter.get("/:conversationId/messages", validateTokenMiddleware, conversationController.getMessagesOfConversation)
conversationRouter.get("/:conversationId", validateTokenMiddleware, conversationController.getConversation)
conversationRouter.get("/", validateTokenMiddleware, conversationController.getConversations)
conversationRouter.post("/", validateTokenMiddleware, conversationController.createConversation)

export default conversationRouter;