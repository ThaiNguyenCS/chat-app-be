import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
export const verifyPassword = async (password: string, hashedPassword: string) => {
    const isMatched = await bcrypt.compare(password, hashedPassword)
    return isMatched
}

export const generateHashPassword = async (password: string) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
}