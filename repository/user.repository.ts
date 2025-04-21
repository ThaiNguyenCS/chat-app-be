import { Op } from "sequelize";
import User, { UserCreateInstance } from "../models/User.model";

class UserRepository {
    createUser = async (userId: string, data: UserCreateInstance) => {
        const user = await User.create({
            ...data,
            id: userId,
        });
        return user;
    }

    checkUsersExist = async (userIds: string[]): Promise<boolean> => {
        const users = await User.findAll({
            where: { id: { [Op.in]: userIds } }
        });
        return users.length === userIds.length;
    }
}

export default UserRepository;