import { Request, Response } from 'express'
import User, { IUser } from '../models/user'

const getLogin = (req: Request, res: Response) => {
    res.render("login")
}

const postLogin = (req: Request, res: Response) => {

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
    });

    res.render("login")
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

export default {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
}