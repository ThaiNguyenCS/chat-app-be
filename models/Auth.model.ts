import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/database"

interface AuthInstance {
    id: string
    phoneNumber: string
    password: string
    createdAt: Date
    lastActiveAt: Date
}

interface AuthCreateInstance extends Optional<AuthInstance, "createdAt" | "lastActiveAt"> { };


class Auth extends Model<AuthInstance, AuthCreateInstance> implements AuthInstance {
    public id!: string
    public phoneNumber!: string
    public password!: string
    public createdAt!: Date
    public lastActiveAt!: Date
}
Auth.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        lastActiveAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        sequelize: sequelize
    })

export default Auth

