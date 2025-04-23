import Conversation from "../../models/Conversation.model";
import User from "../../models/User.model";

export interface ConversationResponse {
    id: string;
    deleted?: boolean;
    name: string;
    createdAt: Date;
    typ: "group" | "private";
    unreadMessage?: number;
    Users?: User[]
}

export type ConversationQueryDTO = {
    conversationId: string
}

export const toConversationDTO = (conversation: Conversation) => {
    return {
        id: conversation.id,
        name: conversation.name,
        createdAt: conversation.createdAt,
        typ: conversation.typ,
        Users: conversation.Users
    } as ConversationResponse
}