import { io } from "socket.io-client";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyOGYxZWVkLWRlOTAtNGJhMy05MzJjLTdmZWNhOWFiNTc0YyIsInBob25lTnVtYmVyIjoiMDU1OTQzNTQ2NyIsImlhdCI6MTc0NTMzNzg1MiwiZXhwIjoxNzQ3OTI5ODUyfQ.SUXRAY_UZ3MYhov7qfyl78k32t-YtOlXRi0-yBNrfkU"
const conversations: string[] = ["74c61bec-103d-48c6-b5ea-75a6efb3dfa9"]
const socket = io("http://localhost:5000",
    {
        auth: {
            token: token
        }
    }
);

for (let i = 0; i < conversations.length; i++) {
    socket.emit("join-conversation", conversations[i])
}

socket.on("message", (data) => {
    console.log(`receive message`, data)
})

socket.on("typing", (data) => {
    console.log(`typing`, data)
})

socket.on("seen", (data) => {
    console.log(`seen`, data)
})


process.stdin.on('data', async function (input: string) {
    input = input.toString()
    const cmds = input.split(" ");
    switch (cmds[0]) {
        case "typing":
            socket.emit("typing", { conversationId: conversations[parseInt(cmds[1])] })
            break;
        case "seen":
            socket.emit("seen", { conversationId: conversations[parseInt(cmds[1])], timestamp: new Date() })
            break;
        case "send":
            try {
                const response = await socket.emitWithAck("message", { content: cmds[2], conversationId: conversations[parseInt(cmds[1])] })
                console.log("Server acknowledged with:", response);
            } catch (error) {
                console.error("error when sending message ", error);
            }
            break;
        default:
            break;
    }
});