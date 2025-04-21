import { toAuthDTO } from "../dto/auth.dto";
import AppError from "../errors/AppError";
import Auth from "../models/Auth.model";
import AuthRepository from "../repository/auth.repository";
import { generateJWTToken } from "../utils/jwt";
import { generateHashPassword, verifyPassword } from "../utils/password";
import { generateUUID } from "../utils/uuid";

class AuthService {
    private authRepository: AuthRepository;
    constructor({ authRepository }: { authRepository: AuthRepository }) {
        this.authRepository = authRepository;
    }

    login = async (data: { phoneNumber: string, password: string }) => {
        const { phoneNumber, password } = data;
        const auth = await this.authRepository.findByPhoneNumber(phoneNumber);
        if (!auth) {
            throw new AppError(404, "User not found");
        }
        const isPasswordValid = await verifyPassword(password, auth.password);
        if (!isPasswordValid) {
            throw new AppError(401, "Wrong password");
        }
        const token = generateJWTToken(toAuthDTO(auth));
        return token;
    }

    register = async (data: { phoneNumber: string, password: string }) => {
        const { phoneNumber, password } = data;
        const auth = await this.authRepository.findByPhoneNumber(phoneNumber);
        if (auth) {
            throw new AppError(409, "User already exists");
        }
        const hashedPassword = await generateHashPassword(password);
        const newAuth = await Auth.create({
            id: generateUUID(),
            phoneNumber,
            password: hashedPassword
        });
        return newAuth;
    }
}

export default AuthService;