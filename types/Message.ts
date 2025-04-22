export type Message = {
    id: string
    content: string;
    conversationId: string;
    mediaUrl?: string;
    mediaType?: string;
};

export type TypingNotification = {
    conversationId: string;
}

export type SeenNotification = {
    conversationId: string;
    timestamp: string
}