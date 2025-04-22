import { Router } from 'express';
import { validateTokenMiddleware } from '../middlewares/authenticate.middleware';
import { conversationController } from '../config/container';
const conversationRouter = Router();

conversationRouter.get("/:conversationId/messages", validateTokenMiddleware, conversationController.getMessagesOfConversation)
conversationRouter.get("/", validateTokenMiddleware, conversationController.getConversations)
conversationRouter.post("/", validateTokenMiddleware, conversationController.createConversation)

export default conversationRouter;