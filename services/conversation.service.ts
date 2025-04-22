import User from "../models/User.model";
import ConversationRepository from "../repository/conversation.repository";
import Conversation from "../models/Conversation.model";
import runTransaction from "../utils/transaction-manager";
import UserConversationRepository from "../repository/user-conversation.repository";
import AppError from "../errors/AppError";
import UserRepository from "../repository/user.repository";
import { generateUUID } from "../utils/uuid";
import { Op } from "sequelize";
import Message from "../models/Message.model";
import { toMessageDTO } from "../dto/message.dto";
import User_Conversation from "../models/User_Conversation.model";
import { toConversationDTO } from "../dto/response/conversation.dto";

class ConversationService {
    private conversationRepository: ConversationRepository;
    private userConversationRepository: UserConversationRepository;
    private userRepository: UserRepository;
    constructor({ conversationRepository, userConversationRepository, userRepository }: { conversationRepository: ConversationRepository, userConversationRepository: UserConversationRepository, userRepository: UserRepository }) {
        this.conversationRepository = conversationRepository // Replace with actual initialization
        this.userConversationRepository = userConversationRepository
        this.userRepository = userRepository;
    }

    checkIfPrivateConversationExists = async (userIds: string[]) => {

        const conversation = await Conversation.findOne({
            where: {
                typ: "private",
            },
            include: [
                {
                    model: User,
                    through: {
                        attributes: [], //  Exclude the join table attributes
                        where: {
                            userId: { [Op.in]: userIds }, // Filter by the user ID
                        }
                    },
                }
            ]
        })
        return conversation
    }

    getConversations = async (userId: string) => {
        const conversations = await this.conversationRepository.getConversations(userId)
        return conversations;
    }

    createConversation = async (userId: string, data: { name: string, userIds: string[] }) => {
        const { name, userIds } = data
        // check if the user add himself to the userIds
        if (userIds.find(id => userId === id) != null) {
            throw new AppError(403, "You cannot add yourself to the conversation")
        }

        const isUsersValid = await this.userRepository.checkUsersExist(userIds)
        if (!isUsersValid) {
            throw new AppError(404, "Some users do not exist")
        }


        await runTransaction(async (transaction: any) => {

            const conversationType = userIds.length > 1 ? "group" : "private"
            if (conversationType === "private") {
                const privateConversation = await this.checkIfPrivateConversationExists([userId, ...userIds])
                if (privateConversation) {
                    throw new AppError(409, "Private conversation already exists")
                }
            }
            const conversation = await this.conversationRepository.createConversation({
                id: generateUUID(), // Assuming userId is the conversation ID for simplicity
                name: name, // Default name, can be changed later
                ownerId: userId, // Assuming the user creating the conversation is the owner
                typ: conversationType, // Assuming group conversation for simplicity
            }, transaction);

            await this.userConversationRepository.addUsersToConversation(conversation.id, [userId, ...data.userIds], transaction)
            return conversation;
        })
    }

    getUsersOfAConversation = async (conversationId: string) => {
        const users = User.findAll({
            include: [
                {
                    model: Conversation,
                    through: { attributes: [] },
                    where: {
                        id: conversationId  // Filter by the conversation ID
                    }
                }
            ]
        })
        return users;
    }



    addUsersToConversation = async (conversationId: string, userId: string) => {

    }

    deleteUsersFromConversation = async (conversationId: string, userId: string) => {

    }


    getMessagesOfConversation = async (userId: string, data: { conversationId: string, limit: number, page: number }) => {
        const { conversationId, page, limit } = data
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

        const res = await Message.findAndCountAll({
            where: {
                conversationId: conversationId
            },
            order: [["createdAt", "DESC"]],
            limit: 50,
            offset: (page - 1) * limit
        })
        // if message is deleted, change it content, mediaurl, ... to null
        let messagesResponse = res.rows.map(item => {
            if (item.deleted) {
                item.content = "Tin nhắn đã bị xóa"
                item.mediaUrl = "Tin nhắn đã bị xóa"
                item.mediaType = ""
            }
            return toMessageDTO(item)
        })
        return {
            data: messagesResponse,
            totalPages: Math.round(res.count / limit),
            limit: limit,
            page: page,
        }
    }
    seenAck = async (data: {
        userId: string,
        conversationId: string,
        timestamp: string
    }) => {
        const { userId, conversationId, timestamp } = data
        await User_Conversation.update({
            lastSeenAt: new Date(timestamp),
        }, {
            where: {
                conversationId: conversationId,
                userId: userId
            }
        })
    }
}
export default ConversationService;