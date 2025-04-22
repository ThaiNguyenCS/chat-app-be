import Conversation from "./Conversation.model";
import User from "./User.model";

User.belongsToMany(Conversation, {
    through: "User_Conversations",
    foreignKey: "userId"
})

Conversation.belongsToMany(User, {
    through: "User_Conversations",
    foreignKey: "conversationId"
})
