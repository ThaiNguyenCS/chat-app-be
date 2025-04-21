import { Server, Socket } from "socket.io";
import logger from "../logger/logger";
import { verifyJWTToken } from "../utils/jwt";
import { conversationService, messageService } from "../config/container";
import { generateUUID } from "../utils/uuid";


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
            this.handleLeaveConversation(socket)
            this.handleMessage(socket, decoded.id)
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

    private handleMessage(socket: Socket, userId: string) {
        socket.on("message", async (data) => {
            // store message in database
            await messageService.createMessage({
                id: generateUUID(),
                content: data.message,
                senderId: userId,
                conversationId: data.conversationId,
                mediaUrl: data.mediaUrl,
                mediaType: data.mediaType,
            })
            //TODO: emit message to all clients in conversation
            const users = await conversationService.getUsersOfAConversation(data.conversationId)
            users.forEach((user: any) => {
                if (this.connections[user.id]) {
                    this.connections[user.id].emit("message", data)
                }
            })

            const { conversationId, message } = data
            logger.info("Message received: " + message + " in conversation: " + conversationId);
        })
    }

    private handleDisconnect(socket: Socket, userId: string) {
        socket.on("disconnect", () => {
            logger.info("Client disconnected")
            // remove disconnected client from connections
            delete this.connections[userId];
        })
    }
}

export default SocketService;