import { Op } from "sequelize";
import User_Conversation from "../models/User_Conversation.model";

class UserConversationRepository {
    addUsersToConversation = async (conversationId: string, userIds: string[], transaction = null) => {
        const items = userIds.map((userId) => ({
            userId: userId,
            conversationId: conversationId,
        }));
        await User_Conversation.bulkCreate(items, {
            ignoreDuplicates: true,
            ...(transaction ? { transaction: transaction } : {})
        })
    }

    deleteUsersFromConversation = async (conversationId: string, userIds: string[], transaction = null) => {
        await User_Conversation.destroy({
            where: {
                conversationId: conversationId,
                userId: { [Op.in]: userIds }

            },
            ...(transaction ? { transaction: transaction } : {})
        });
    }

}

export default UserConversationRepository;