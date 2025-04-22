import { Server, Socket } from "socket.io";
import logger from "../logger/logger";
import { verifyJWTToken } from "../utils/jwt";
import { conversationService, messageService } from "../config/container";
import { generateUUID } from "../utils/uuid";
import { messageSchema, seenSchema } from "../validators/message-schema";
import { Message, SeenNotification, TypingNotification } from "../types/Message";


class SocketService {
    private connections: any = {}
    public initSocketServer(httpServer: any) {
        const server = new Server(httpServer, {
            cors: {
                origin: "*", //TODO: temp
            }
        })
        server.on("connection", (socket: Socket) => {
            //TODO: TOKEN here
            const token = socket.handshake.auth.token;
            let decoded = null;
            if (!token) {
                logger.error("No token provided")
                return socket.disconnect(true)
            }
            try {
                decoded = verifyJWTToken(token)
            } catch (error) {
                logger.error("Token invalid")
                return socket.disconnect(true)
            }
            logger.info("User connected: " + decoded.id);
            this.connections[decoded.id] = socket
            this.handleJoinConversation(socket)
            // this.handleLeaveConversation(socket)
            this.handleMessage(socket, decoded.id)
            this.handleTyping(socket, decoded.id)
            this.handleMessageSeen(socket, decoded.id)
            this.handleDisconnect(socket, decoded.id)

        })
        server.on("error", (error) => {
            logger.error("Socket error: " + error.message);
        })
    }

    private handleJoinConversation(socket: Socket) {
        socket.on('join-conversation', (conversationId: string) => {
            socket.join(conversationId);
            logger.info(`Socket ${socket.id} joined conversation ${conversationId}`);
        });
    }

    private handleLeaveConversation(socket: Socket) {
        socket.on('leave-conversation', (conversationId) => {
            socket.leave(conversationId);
            logger.info(`Socket ${socket.id} left conversation ${conversationId}`);
        });
    }

    private handleTyping(socket: Socket, userId: string) {
        socket.on("typing", (data: TypingNotification) => {
            const { conversationId } = data
            socket.to(conversationId).emit("typing", {
                conversationId: conversationId,
                userId: userId,
            })
            logger.info("User " + userId + " is typing in conversation: " + conversationId);
        })
    }

    private handleMessageSeen(socket: Socket, userId: string) {
        socket.on("seen", async (data: SeenNotification) => {
            try {
                await seenSchema.validateAsync(data)
                const { conversationId, timestamp } = data
                logger.info("User " + userId + " seen conversation: " + conversationId);
                // notify realtime
                socket.to(conversationId).emit("seen", {
                    conversationId: conversationId,
                    userId: userId,
                })
                // update seen time to database
                await conversationService.seenAck({
                    userId, conversationId, timestamp
                })
                // Update message seen status in database
            } catch (error) {
                logger.error(error)
            }

        })
    }

    private handleMessage(socket: Socket, userId: string) {
        socket.on("message", async (data: Message, callback: any) => {
            try {
                const { conversationId, content } = data
                logger.info("Message received: " + content + " in conversation: " + conversationId);
                await messageSchema.validateAsync(data);
                // store message in database
                await messageService.createMessage({
                    id: generateUUID(),
                    content: data.content,
                    senderId: userId,
                    conversationId: data.conversationId,
                    mediaUrl: data.mediaUrl,
                    mediaType: data.mediaType,
                })
                // emit message to all clients in conversation
                const users = await conversationService.getUsersOfAConversation(data.conversationId)
                users.forEach((user: any) => {
                    if (this.connections[user.id]) {
                        this.connections[user.id].emit("message", data)
                    }
                })
                // confirm to sender that message was sent
                callback({
                    status: "success",
                    conversationId: data.conversationId,
                    messageId: data.id,
                });
            } catch (error: any) {
                logger.error("Message validation error: " + error.message);
                callback({
                    status: "failed",
                    conversationId: data.conversationId,
                    messageId: data.id,
                });
            }
        })
    }

    private handleDisconnect(socket: Socket, userId: string) {
        socket.on("disconnect", () => {
            logger.info("Client disconnected")
            // remove disconnected client from connections
            delete this.connections[userId];
            logger.info("Connections length: " + Object.keys(this.connections).length)
        })
    }
}

export default SocketService;