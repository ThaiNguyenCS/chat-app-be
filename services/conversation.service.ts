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
import User_Conversation, { USER_ROLES_IN_CONVERSATION } from "../models/User_Conversation.model";
import ConversationValidator from "./conversationValidator.service";
import { ConversationQueryDTO, ConversationResponse, toConversationDTO } from "../dto/response/conversation.dto";
import { toUserDto } from "../dto/response/user.dto";

class ConversationService {
    private conversationRepository: ConversationRepository;
    private userConversationRepository: UserConversationRepository;
    private userRepository: UserRepository;
    private conversationValidator: ConversationValidator;

    constructor({ conversationRepository, userConversationRepository, userRepository, conversationValidator }: { conversationRepository: ConversationRepository, userConversationRepository: UserConversationRepository, userRepository: UserRepository, conversationValidator: ConversationValidator }) {
        this.conversationRepository = conversationRepository // Replace with actual initialization
        this.userConversationRepository = userConversationRepository
        this.userRepository = userRepository;
        this.conversationValidator = conversationValidator;
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

    getConversation = async (userId: string, data: ConversationQueryDTO) => {
        await this.conversationValidator.ensureUserInConversation(userId, data.conversationId);
        const conversation = await this.conversationRepository.getConversation(data.conversationId);
        let formatConversation: any = conversation
        formatConversation.Users = conversation!.Users.map(u => {
            console.log(u.User_Conversations.getDataValue("lastSeenAt"));
            return toUserDto(u)
        })
        formatConversation = toConversationDTO(formatConversation)
        return formatConversation;
    }


    getConversations = async (userId: string) => {
        const conversations = await this.conversationRepository.getConversations(userId)
        const result: ConversationResponse[] = await Promise.all(conversations.map(async c => {
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
        return result;
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
                typ: conversationType, // Assuming group conversation for simplicity
            }, transaction);

            await this.userConversationRepository.addUsersToConversation(conversation.id, [userId, ...data.userIds], transaction)

            // make the user create this conversation to be owner 
            await this.userConversationRepository.update(conversation.id, userId, { role: USER_ROLES_IN_CONVERSATION.OWNER })
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
        await this.conversationValidator.ensureUserInConversation(userId, conversationId);

        const res = await Message.findAndCountAll({
            where: {
                conversationId: conversationId
            },
            include: [{
                model: User,
                as: "sender",
                attributes: ["id", "displayName", "avatarUrl"]
            }],
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