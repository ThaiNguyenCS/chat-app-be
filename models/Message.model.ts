import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User.model";

export interface MessageInstance {
    id: string
    deleted: boolean
    createdAt: Date
    content: string
    senderId: string
    conversationId: string
    mediaUrl: string
    mediaType: string
    status: string
    sender? : User
}

export interface MessageCreateInstance extends Optional<MessageInstance, 'deleted' | 'createdAt' | 'mediaType' | 'mediaUrl' | "status"> {
}


class Message extends Model<MessageInstance, MessageCreateInstance> implements MessageInstance {
    public id!: string;
    public name!: string;
    public deleted!: boolean;
    public createdAt!: Date;
    public content!: string;
    public senderId!: string;
    public conversationId!: string;
    public mediaUrl!: string;
    public mediaType!: string;
    public status!: string
}

Message.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
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
    content: {
        type: DataTypes.TEXT,
    },
    senderId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    conversationId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mediaUrl: {
        type: DataTypes.STRING,
    },
    mediaType: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM("sent", "delivered", "read"),
        defaultValue: "sent",
        validate: {
            isIn: {
                msg: "message status must be sent, delivered, read",
                args: [["sent", "delivered", "read"]]
            },
        }
    },
}, {
    sequelize: sequelize,
})
export default Message;