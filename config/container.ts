import AuthController from "../controllers/auth.controller";
import ConversationController from "../controllers/conversation.controller";
import UserController from "../controllers/user.controller";
import AuthRepository from "../repository/auth.repository";
import ConversationRepository from "../repository/conversation.repository";
import MessageRepository from "../repository/message.repository";
import UserConversationRepository from "../repository/user-conversation.repository";
import UserRepository from "../repository/user.repository";
import AuthService from "../services/auth.service";
import ConversationService from "../services/conversation.service";
import ConversationValidator from "../services/conversationValidator.service";
import MessageService from "../services/message.service";
import SocketService from "../services/socket.service";
import UserService from "../services/user.service";

const socketService = new SocketService()


const authRepository = new AuthRepository()
const authService = new AuthService({ authRepository })
const authController = new AuthController({ authService })

const userRepository = new UserRepository()
const userService = new UserService({ userRepository })
const userController = new UserController({ userService })

const messageRepository = new MessageRepository()
const messageService = new MessageService({ messageRepository })
// const messageController = new MessageController({ messageService })

const userConversationRepository = new UserConversationRepository()


const conversationRepository = new ConversationRepository()
export const conversationValidator = new ConversationValidator({ conversationRepository })
const conversationService = new ConversationService({ conversationRepository, userConversationRepository, conversationValidator, userRepository })
const conversationController = new ConversationController({ conversationService })



export { socketService, authController, userController, messageService, conversationService, conversationController };

