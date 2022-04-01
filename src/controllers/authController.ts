import { Request, Response } from 'express'
import User, { IUser } from '../models/user'
import { validationResult } from 'express-validator'

declare module 'express-session' {
    interface Session {
        user: IUser
    }
}

const getLogin = (req: Request, res: Response) => {

    if (req.session.user) {
        return res.redirect('/')
    }

    res.render("login")
}

const postLogin = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.render('login', {
                errors: errors.array()
            })
        }

        const { email, password } = req.body

        //check if user exists and password is valid
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.render('login')
        }

        const isPwdCorrect = await user.correctPassword(password, user.password)

        if (!isPwdCorrect) {
            throw 'invalid password';
        }

        user.password = undefined;
        req.session.user = user;

        req.flash('info', 'Login successful')

        res.redirect('/');
    } catch (e) {
        console.log(e)
        return res.redirect('back')
    }
}

const getRegister = (req: Request, res: Response) => {

    if (req.session.user) {
        return res.redirect('/')
    }

    res.render("register")
}

const postRegister = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.render('register', {
                errors: errors.array()
            })
        }

        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirm_password: req.body.confirm_password,
        });

        res.render("register")
    } catch (e) {
        console.log(e)
        res.redirect('back')
    }
}

const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        console.log(err)
    });

    res.redirect('/');
}

export default {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    logout,
}