import { Request, Response } from 'express'
import Connection from '../models/connections';
import User from '../models/user'

const getUser = async (req: Request, res: Response) => {

    let regex = new RegExp(req.query.search as string, "i")

    let users = await User.find({ "username": regex });

    users = users.filter(function (user) {
        return user._id.toString() !== req.session.user._id.toString()
    })

    let connectionLists = []
    for (const user of users) {

        let foundConnection = await Connection.find({ users: { $all: [user._id, req.session.user._id] } });
        if (foundConnection && user._id.toString() != req.session.user._id.toString()) {
            connectionLists.push(user._id.toString())
        }

    }

    return res.status(200).json({
        success: true,
        data: {
            users,
            connectionLists
        }
    })
}

const createConnection = async (req: Request, res: Response) => {
    let userId = req.query.userId;

    await Connection.create({
        users: [
            userId,
            req.session.user._id
        ]
    })

    return res.status(200).json({
        success: true,
    })
}

export default {
    getUser,
    createConnection
}
