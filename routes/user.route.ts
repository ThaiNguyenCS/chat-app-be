import { Router } from "express"
import { userController } from "../config/container"
import { validateTokenMiddleware } from "../middlewares/authenticate.middleware"

const userRouter = Router()
userRouter.post("/profile", validateTokenMiddleware, userController.createProfile)

export default userRouter