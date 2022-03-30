import { Request, Response } from 'express'
import User, { IUser } from '../models/user'

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
        const { email, password } = req.body

        //check if user exists and password is valid
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.render('login')
        }

        const isPwdCorrect = await user.correctPassword(password, user.password)

        if (!isPwdCorrect) {
            return res.render('login')
        }

        user.password = undefined;
        req.session.user = user;

        req.flash('info', 'Login successful')

        res.redirect('/');
    } catch (e) {
        console.log(e)
    }
}

const getRegister = (req: Request, res: Response) => {

    if (req.session.user) {
        return res.redirect('/')
    }

    res.render("register")
}

const postRegister = async (req: Request, res: Response) => {

    let user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
    });

    res.render("register")
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