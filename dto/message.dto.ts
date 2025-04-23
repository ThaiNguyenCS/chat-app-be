import { MessageInstance } from "../models/Message.model"

export const toMessageDTO = (message: MessageInstance) => {
    return {
        id: message.id,
        content: message.content,
        mediaUrl: message.mediaUrl,
        sender: message.sender,
        mediaType: message.mediaType,
        createdAt: message.createdAt,
    }
}