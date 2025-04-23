import Conversation, { ConversationCreateInstance } from "../models/Conversation.model";
import User from "../models/User.model";

class ConversationRepository {
    findById = async (conversationId: string) => {
        const conversation = await Conversation.findByPk(conversationId);
        return conversation
    }

    createConversation = async (conversation: ConversationCreateInstance, transaction = null) => {
        const newConversation = await Conversation.create({
            id: conversation.id,
            typ: conversation.typ,
            name: conversation.name,
        }, transaction ? { transaction: transaction } : {})
        return newConversation
    }


    getConversation = async (conversationId: string, transaction = null) => {
        const conversation = await Conversation.findOne({
            include: [
                {
                    model: User,
                    attributes: ["id", "avatarUrl", "displayName"],
                    through: {
                        attributes: ["lastSeenAt", "role"],
                    },
                }
            ],
            where: {
                id: conversationId
            },
            ...(transaction ? { transaction: transaction } : {})
        })
        return conversation
    }

    getConversations = async (userId: string, transaction = null) => {
        const conversations = await Conversation.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id"],
                    through: {
                        attributes: ["lastSeenAt", "role"],
                        where: {
                            userId: userId // Filter by the user ID
                        },
                    },
                }
            ],
            ...(transaction ? { transaction: transaction } : {})
        })
        return conversations
    }
}

export default ConversationRepository;