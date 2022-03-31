import { Router } from 'express'
import homeController from '../../controllers/homeController'

const router = Router();

router.get('/user', homeController.getUser);

router.get('/connection', homeController.createConnection)

router.get('/chats', homeController.getChats)

export default router
