import Conversation, { ConversationCreateInstance } from "../models/Conversation.model";
import User from "../models/User.model";

class ConversationRepository {
    createConversation = async (conversation: ConversationCreateInstance, transaction = null) => {
        const newConversation = await Conversation.create({
            id: conversation.id,
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