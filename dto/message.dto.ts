import { MessageInstance } from "../models/Message.model"

export const toMessageDTO = (message: MessageInstance) => {
    return {
        id: message.id,
        content: message.content,
        mediaUrl: message.mediaUrl,
        senderId: message.senderId,
        mediaType: message.mediaType,
        createdAt: message.createdAt,
    }
}