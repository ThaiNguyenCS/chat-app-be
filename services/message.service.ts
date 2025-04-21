import AppError from "../errors/AppError";
import { MessageCreateInstance } from "../models/Message.model";
import MessageRepository from "../repository/message.repository";

class MessageService {
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
}



export default MessageService;