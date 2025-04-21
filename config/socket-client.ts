import { Server } from "socket.io"

/**
 * Initializes a Socket.IO server with the given HTTP server.
 * @param httpServer - The HTTP server to attach the Socket.IO server to.
 * @returns The initialized Socket.IO server.
 */
function initSocketServer(httpServer: any) {
    const server = new Server(httpServer, {
        cors: {
            origin: "*", //TODO: temp
        }
    })
    server.on("connection", (socket) => {
        console.log("Client connected")
        socket.on("disconnect", () => {
            console.log("Client disconnected")
        })
    })
}

export { initSocketServer }