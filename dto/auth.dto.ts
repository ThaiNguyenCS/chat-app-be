import Auth from "../models/Auth.model";

export const toAuthDTO = (auth: Auth) => {
    return {
        id: auth.id,
        phoneNumber: auth.phoneNumber
    };
};