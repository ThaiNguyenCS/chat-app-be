import Auth from "../models/Auth.model";

class AuthRepository {
    findByPhoneNumber(phoneNumber: string) {
        return Auth.findOne({ where: { phoneNumber } });
    }
}
export default AuthRepository