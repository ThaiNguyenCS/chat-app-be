import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export const USER_ROLES_IN_CONVERSATION = { OWNER: "owner", MEMBER: "member" }

interface User_ConversationInstance {
    userId: string
    conversationId: string
    createdAt: Date,
    lastSeenAt: Date,
    deleted: boolean
    role: string
}

interface User_ConversationCreateInstance extends Optional<User_ConversationInstance, "createdAt" | "deleted" | "lastSeenAt" | "role"> { };

class User_Conversation extends Model<User_ConversationInstance, User_ConversationCreateInstance> implements User_ConversationInstance {
    public userId!: string;
    public conversationId!: string;
    public deleted!: boolean;
    public createdAt!: Date;
    public lastSeenAt!: Date;
    public role!: string
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
        role: {
            type: DataTypes.ENUM(...Object.values(USER_ROLES_IN_CONVERSATION)),
            validate: {
                isIn: [Object.values(USER_ROLES_IN_CONVERSATION)]
            },
            defaultValue: "member"
        }
        ,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        lastSeenAt: {
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

// User_Conversation.sync({ alter: true })

export default User_Conversation;