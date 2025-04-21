import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface User_ConversationInstance {
    userId: string
    conversationId: string
    createdAt: Date
}

interface User_ConversationCreateInstance extends Optional<User_ConversationInstance, "createdAt"> { };

class User_Conversation extends Model<User_ConversationInstance, User_ConversationCreateInstance> implements User_ConversationInstance {
    public userId!: string;
    public conversationId!: string;
    public createdAt!: Date;
}

User_Conversation.init(
    {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: "users",
                key: "id"
            }
        },
        conversationId: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: "conversations",
                key: "id"
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        sequelize: sequelize,
        indexes: [{
            fields: ["userId", "conversationId"],
            unique: true
        }]
    }
)

export default User_Conversation;