import { Router, Request, Response } from 'express'
import authController from '../../controllers/authController'

const router = Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

export default router;
