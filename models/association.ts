import Conversation from "./Conversation.model";
import User from "./User.model";

User.belongsToMany(Conversation, {
    through: "User_Conversation",
    foreignKey: "userId"
})


Conversation.belongsToMany(User, {
    through: "User_Conversation",
    foreignKey: "conversationId"
})
