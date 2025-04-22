import { io } from "socket.io-client";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3ZDI4ZDE1LWVmOWEtNGVlNy1hNjhmLThjMjQ3YmMxZGIxMCIsInBob25lTnVtYmVyIjoiMDU1OTQzNTQ2NyIsImlhdCI6MTc0NTMxMjUzMywiZXhwIjoxNzQ3OTA0NTMzfQ.FBJriR6n7t6wSuOc-bdydMCu-LsJKN0QkELP0CtvJks"
const conversations: string[] = ["d5a0e231-36af-4816-a133-28aa1659f053"]
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