import { io } from "socket.io-client";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMxYzQ2Mjg0LWMxM2QtNDk3YS1iMzJiLTg2NmFhMzQ0YTc5MyIsInBob25lTnVtYmVyIjoiMDk2NDkyNzQzNyIsImlhdCI6MTc0NTMzNzgzOSwiZXhwIjoxNzQ3OTI5ODM5fQ.9tKNqJ3DnruTictRxY9YsJFDrHF8sWoQX7Eu8shxUag"
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
                const response = await socket.timeout(10000).emitWithAck("message", { content: cmds[2], conversationId: conversations[parseInt(cmds[1])] })
                console.log("Server acknowledged with:", response);
            } catch (error) {
                console.error("error when sending message ", error);
            }
            break;
        default:
            break;
    }
});