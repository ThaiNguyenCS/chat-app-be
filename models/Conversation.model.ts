import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ConversationInstance {
    id: string
    deleted: boolean
    name: string
    createdAt: Date
    ownerId: string
    typ: "group" | "private"
}

export interface ConversationCreateInstance extends Optional<ConversationInstance, 'deleted' | 'createdAt'> {
}

class Conversation extends Model<ConversationInstance, ConversationCreateInstance> implements ConversationInstance {
    public id!: string;
    public deleted!: boolean;
    public createdAt!: Date;
    public name!: string;
    public typ!: "group" | "private";
    public ownerId!: string
}

Conversation.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    ownerId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        }
    },
    typ: {
        type: DataTypes.ENUM("group", "private"),
        allowNull: false,
        defaultValue: "private",
        validate: {
            isIn: [["group", "private"]],
        }
    }
}, {
    sequelize: sequelize,
})

// Conversation.sync({ alter: true })

export default Conversation;