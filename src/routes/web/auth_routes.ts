import { Router, Request, Response } from 'express'
import authController from '../../controllers/authController'
import Connection from '../../models/connections'

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    let connections = await Connection.find({ users: req.session.user._id }).populate('users');
    console.log(connections)

    return res.render('home', { messages: req.flash('info'), connections: connections })
});

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

router.post('/logout', authController.logout);

export default router;
