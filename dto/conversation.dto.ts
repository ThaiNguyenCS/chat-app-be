import Conversation from "../models/Conversation.model";

export const toConversationDTO = (conversation: Conversation) => {
    return {
        id: conversation.id,
        name: conversation.name,
        ownerId: conversation.ownerId,
        createdAt: conversation.createdAt,
    }
}