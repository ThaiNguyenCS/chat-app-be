import AppError from "../errors/AppError";
import User_Conversation from "../models/User_Conversation.model";
import ConversationRepository from "../repository/conversation.repository";

class ConversationValidator {
    private conversationRepository;
    constructor({ conversationRepository }: { conversationRepository: ConversationRepository }) {
        this.conversationRepository = conversationRepository
    }

    ensureUserInConversation = async (userId: string, conversationId: string) => {
        const conversation = await this.conversationRepository.findById(conversationId);
        // check if conversation exists
        if (!conversation) {
            throw new AppError(404, `Conversation ${conversationId} not found`);
        }

        // check if user is in this conversation
        const isExist = await User_Conversation.findOne({
            where: {
                userId: userId,
                conversationId: conversationId,
                deleted: false
            }
        })
        if (!isExist) {
            throw new AppError(403, `Conversation ${conversationId} not found or deleted`);
        }
    }
}

export default ConversationValidator