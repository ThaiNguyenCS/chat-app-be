import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

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
            type: DataTypes.ENUM("male", "female", "other"),
            allowNull: false,
            validate: {
                isIn: [["male", "female", "other"]]
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