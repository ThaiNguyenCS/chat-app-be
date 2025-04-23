import User from "../../models/User.model";

export const toUserDto = (user: User) => {
    return {
        id: user.id,
        displayName: user.displayName,
        lastSeenAt: user.User_Conversations?.getDataValue("lastSeenAt"),
        role: user.User_Conversations?.getDataValue("role"),
    }
}