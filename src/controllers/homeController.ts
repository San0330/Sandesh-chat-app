import { Request, Response } from 'express'
import User, { IUser } from '../models/user'

const getUser = async (req: Request, res: Response) => {

    let regex = new RegExp(req.query.search as string, "i")

    let users = await User.find({ "username": regex }).limit(3);

    return res.status(200).json({
        success: true,
        data: users,
    })
}

export default {
    getUser
}
