import config from './config/config'
import path from 'path'
import express, { Express, Request, Response } from 'express'

import mongoose from 'mongoose'

mongoose.connect(config.db)
const db = mongoose.connection

db.on("error", () => console.error("Connection error!"))
db.once("open", () => console.log("Connected successfully"))

const app: Express = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json()); 

app.use(express.static(path.join(path.dirname(__dirname), 'public')))

app.set('view engine', 'pug')
app.set('views', path.join(path.dirname(__dirname), 'views'))

app.get('/', (req: Request, res: Response) => {
    res.send("hello world")
});

app.get('/login', (req: Request, res: Response) => {
    res.render("login")
});

app.get('/register', (req: Request, res: Response) => {
    res.render("register")
});

app.all('*', (_, res: Response) => {
    res.render('404')
})

const APP_PORT = config.app_port || 4000
app.listen(APP_PORT, () => console.log(`Server started at port ${APP_PORT}`))