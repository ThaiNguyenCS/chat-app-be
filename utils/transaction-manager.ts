import sequelize from "../config/database";

const runTransaction = async (cb: any) => {
    const transaction = await sequelize.transaction();
    try {
        const result = await cb(transaction);
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export default runTransaction;