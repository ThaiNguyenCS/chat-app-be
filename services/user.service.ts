import { UserCreateInstance } from "../models/User.model";
import UserRepository from "../repository/user.repository";

class UserService {
    private userRepository: UserRepository;
    constructor({ userRepository }: { userRepository: UserRepository }) {
        this.userRepository = userRepository;
    }

    createProfile = async (userId: string, data: UserCreateInstance) => {
        const profile = await this.userRepository.createUser(userId, data);
        return profile;
    }
}

export default UserService;