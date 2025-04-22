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
            ownerId: conversation.ownerId,
        }, transaction ? { transaction: transaction } : {})
        return newConversation
    }

    getConversations = async (userId: string, transaction = null) => {
        return await Conversation.findAll({
            include: [
                {
                    model: User,
                    attributes: [],
                    through: {
                        attributes: [], // Exclude the join table attributes}]
                        where: {
                            userId: userId // Filter by the user ID
                        }
                    },

                }
            ],
            ...(transaction ? { transaction: transaction } : {})
        })
    }
}

export default ConversationRepository;