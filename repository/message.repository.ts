import Message, { MessageCreateInstance } from "../models/Message.model";
import { generateUUID } from "../utils/uuid";

class MessageRepository {
    async createMessage(message: MessageCreateInstance) {
        const newMessage = await Message.create({
            id: message.id || generateUUID(),
            content: message.content,
            conversationId: message.conversationId,
            senderId: message.senderId,
            mediaUrl: message.mediaUrl,
            mediaType: message.mediaType,
            status: message.status,
        });
        return newMessage;
    }

    async findMessageById(messageId: string) {
        const message = await Message.findOne(
            {
                where: {
                    id: messageId,
                },
            }
        );
        return message;
    }

    async deleteMessage(messageId: string) {
        return await Message.update(
            {
                deleted: true,
            },
            {
                where: {
                    id: messageId,
                },
            }
        );
    }
}

export default MessageRepository