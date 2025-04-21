import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/config";
import AppError from "../errors/AppError";
import { CustomJwtPayload } from "../types/CustomJwtPayload";

const JWT_LIFE_TIME = "30d";

const verifyJWTToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY as string);
        return decoded as CustomJwtPayload
    } catch (error) {
        throw new AppError(401, "Invalid token");
    }
}

const generateJWTToken = (user: any) => {
    const token = jwt.sign(user, JWT_SECRET_KEY as string, {
        expiresIn: JWT_LIFE_TIME,
    });
    return token;
}


export { verifyJWTToken, generateJWTToken }