import Conversation from "./Conversation.model";
import Message from "./Message.model";
import User from "./User.model";

User.belongsToMany(Conversation, {
    through: "User_Conversations",
    foreignKey: "userId"
})

Conversation.belongsToMany(User, {
    through: "User_Conversations",
    foreignKey: "conversationId"
})


Message.belongsTo(User, {
    foreignKey: "senderId",
    targetKey: "id",
    as: "sender"
})
