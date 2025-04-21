import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ConversationInstance {
    id: string
    deleted: boolean
    name: string
    createdAt: Date
    ownerId: string
}

export interface ConversationCreateInstance extends Optional<ConversationInstance, 'deleted' | 'createdAt'> {
}

class Conversation extends Model<ConversationInstance, ConversationCreateInstance> implements ConversationInstance {
    public id!: string;
    public deleted!: boolean;
    public createdAt!: Date;
    public name!: string;
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
}, {
    sequelize: sequelize,
})
export default Conversation;