import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User_Conversation from "./User_Conversation.model";

export const SEX = { MALE: "male", FEMALE: "female", OTHER: "other" };

interface UserInstance {
    id: string
    sex: string
    lastName: string,
    firstName: string,
    email: string,
    displayName: string,
    selfDescription: string,
    dob: Date,
    createdAt: Date,
    avatarUrl: string,
    backgroundUrl: string,
    User_Conversations?: User_Conversation
}

export interface UserCreateInstance extends Omit<UserInstance, "createdAt"> { };

class User extends Model<UserInstance, UserCreateInstance> implements UserInstance {
    public id!: string;
    public sex!: string;
    public lastName!: string;
    public firstName!: string;
    public email!: string;
    public displayName!: string;
    public selfDescription!: string;
    public dob!: Date;
    public createdAt!: Date;
    public avatarUrl!: string;
    public backgroundUrl!: string;
    public User_Conversations!: User_Conversation;
}


User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            references: {
                model: "Auths",
                key: "id",
            }
        },
        sex: {
            type: DataTypes.ENUM(...Object.values(SEX)),
            allowNull: false,
            validate: {
                isIn: [Object.values(SEX)]
            }
        },
        lastName: {
            type: DataTypes.STRING,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            }
        },
        displayName: {
            type: DataTypes.STRING,
        },
        selfDescription: {
            type: DataTypes.STRING,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        avatarUrl: {
            type: DataTypes.STRING,
        },
        backgroundUrl: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize: sequelize, // passing the `sequelize` instance is required
    }
)
export default User;