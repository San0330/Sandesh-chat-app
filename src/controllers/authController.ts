import { Request, Response } from 'express'
import User from '../models/user'

const getLogin = (req: Request, res: Response) => {
    res.render("login")
}

const postLogin = async (req: Request, res: Response) => {

    const { email, password } = req.body

    //check if user exists and password is valid
    const user = await User.findOne({ email }).select('+password')

    if (user) {
        res.render('/login')
    }

    const isPwdCorrect = await user.correctPassword(password, user.password)

    if (!isPwdCorrect) {
        res.render('/login')
    }

    res.render('/')
}

const getRegister = (req: Request, res: Response) => {
    res.render("register")
}

const postRegister = async (req: Request, res: Response) => {

    let user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
    });

    console.log(user)

    res.render("register")
}

const logout = (req: Request, res: Response) => {
    req.session.destroy();
    res.redirect('/');
}

export default {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
}