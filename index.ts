import express from "express";
import { createServer } from "http";
import logger from "./logger/logger";
import sequelize from "./config/database";
import { PORT } from "./config/config";
import { socketService } from "./config/container";
import authRouter from "./routes/auth.route";
import globalErrorHandler from "./errors/error-handler";
import "./models/association"
import userRouter from "./routes/user.route";
import conversationRouter from "./routes/conversation.route";
import cors from "cors";

const app = express();
app.use(cors({
    origin: "*"
}))
app.use(express.json()); // parse json from request body
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/conversations", conversationRouter);

(async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ alter: true });
        logger.info("Connection to the database has been established successfully.");
        const server = createServer(app);
        socketService.initSocketServer(server);
        app.use(globalErrorHandler);
        server.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        logger.error(error);
    }
})()

