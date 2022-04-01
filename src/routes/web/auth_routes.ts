import { Router, Request, Response } from 'express'
import { check } from 'express-validator';
import authController from '../../controllers/authController'
import Connection from '../../models/connections'
import User from '../../models/user'

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    let connections = await Connection.find({ users: req.session.user._id }).populate('users');

    return res.render('home', { messages: req.flash('info'), connections: connections })
});

router.get('/login',
    authController.getLogin
);

router.post('/login', [
    check('email', 'Email is not valid!').isEmail().normalizeEmail(),
    check('password', 'Password must be greater than 8 characters').exists().isLength({ min: 8 })
], authController.postLogin);

router.get('/register', authController.getRegister);

router.post('/register', [
    check('username', 'username must be greater than 3 characters!').exists().isLength({ min: 3 }),
    check('email', 'Email is not valid!').isEmail().normalizeEmail(),
    check('email').custom((value:string) => {
        return User.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        })
    }),
    check('password', 'Password must be greater than 8 characters').exists().isLength({ min: 8 }),
    check('confirm_password').custom((value: string, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }

        return true;
    }),
],
    authController.postRegister);

router.post('/logout', authController.logout);

export default router;
