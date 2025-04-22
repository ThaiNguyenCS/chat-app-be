import Conversation from "../../models/Conversation.model";

export interface ConversationResponse {
    id: string;
    deleted?: boolean;
    name: string;
    createdAt: Date;
    ownerId: string;
    typ: "group" | "private";
    unreadMessage?: number;
}

export const toConversationDTO = (conversation: Conversation) => {
    return {
        id: conversation.id,
        name: conversation.name,
        createdAt: conversation.createdAt,
        ownerId: conversation.ownerId,
        typ: conversation.typ
    } as ConversationResponse
}