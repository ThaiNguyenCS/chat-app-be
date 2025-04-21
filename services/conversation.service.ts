import User from "../models/User.model";
import ConversationRepository from "../repository/conversation.repository";
import Conversation from "../models/Conversation.model";
import runTransaction from "../utils/transaction-manager";
import UserConversationRepository from "../repository/user-conversation.repository";
import AppError from "../errors/AppError";
import { toConversationDTO } from "../dto/conversation.dto";
import UserRepository from "../repository/user.repository";
import { generateUUID } from "../utils/uuid";

class ConversationService {
    private conversationRepository: ConversationRepository;
    private userConversationRepository: UserConversationRepository;
    private userRepository: UserRepository;
    constructor({ conversationRepository, userConversationRepository, userRepository }: { conversationRepository: ConversationRepository, userConversationRepository: UserConversationRepository, userRepository: UserRepository }) {
        this.conversationRepository = conversationRepository // Replace with actual initialization
        this.userConversationRepository = userConversationRepository
        this.userRepository = userRepository;
    }

    getConversations = async (userId: string) => {
        const conversations = await this.conversationRepository.getConversations(userId)
        return conversations.map((conversation: Conversation) => toConversationDTO(conversation));
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
            const conversation = await this.conversationRepository.createConversation({
                id: generateUUID(), // Assuming userId is the conversation ID for simplicity
                name: name, // Default name, can be changed later
                ownerId: userId, // Assuming the user creating the conversation is the owner
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
}
export default ConversationService;