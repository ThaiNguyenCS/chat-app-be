import { Op } from "sequelize";
import Conversation, { ConversationCreateInstance } from "../models/Conversation.model";
import Message from "../models/Message.model";
import User from "../models/User.model";
import { ConversationResponse, toConversationDTO } from "../dto/response/conversation.dto";

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
        const conversations = await Conversation.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id"],
                    through: {
                        attributes: ["lastSeenAt"],
                        where: {
                            userId: userId // Filter by the user ID
                        }

                    },

                }
            ],
            ...(transaction ? { transaction: transaction } : {})
        })
        const result: ConversationResponse[] = await Promise.all(conversations.map(async c => {
            console.log(c)
            const timeline = new Date(c.getDataValue("Users")![0]!.getDataValue("User_Conversations")!.getDataValue("lastSeenAt"))

            const count = await Message.count({
                where: {

                    createdAt: { [Op.gt]: timeline }
                }
            })
            const conv = toConversationDTO(c)
            conv.unreadMessage = count;
            return conv
        }))
        return result
    }
}

export default ConversationRepository;