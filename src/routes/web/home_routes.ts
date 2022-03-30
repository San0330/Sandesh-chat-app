import { Router } from 'express'
import homeController from '../../controllers/homeController'

const router = Router();

router.get('/user', homeController.getUser);

export default router