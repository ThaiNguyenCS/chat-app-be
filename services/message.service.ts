import AppError from "../errors/AppError";
import { MessageCreateInstance } from "../models/Message.model";
import MessageRepository from "../repository/message.repository";

class MessageService {
    MESSAGE_DELETE_PERIOD = 24 * 60 * 60 * 1000; // ms
    private messageRepository: MessageRepository;
    constructor({ messageRepository }: { messageRepository: MessageRepository }) {
        this.messageRepository = messageRepository;
    }

    async createMessage(message: MessageCreateInstance) {
        try {
            const newMessage = await this.messageRepository.createMessage(message);
            return newMessage;
        } catch (error: any) {
            throw new AppError(500, "Error creating message: " + error.message);
        }
    }

    async deleteMessage(userId: string, data: { messageId: string }) {
        const { messageId } = data
        const msg = await this.messageRepository.findMessageById(messageId)

        if (!msg) {
            throw new AppError(404, `Message ${messageId} not found`)
        }

        if (msg.senderId !== userId) {
            throw new AppError(403, `This user cannot perform this action`)
        }
        if (new Date(Date.now()).getTime() - new Date(msg.createdAt).getTime() > this.MESSAGE_DELETE_PERIOD) {
            throw new AppError(403, `This message cannot be deleted anymore`)
        }
        await this.messageRepository.deleteMessage(messageId)
    }
}



export default MessageService;