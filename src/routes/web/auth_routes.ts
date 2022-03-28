import { Router } from 'express'
import authController from '../../controllers/authController'

const router = Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

router.post('/logout', authController.logout);

export default router;
