import config from './config/config'
import path from 'path'
import express, { Express, NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/web/auth_routes'
import homeRoutes from './routes/web/home_routes'
import cookieparser from 'cookie-parser'
import session from 'express-session'
import mongdDBSession from 'connect-mongodb-session'
import { Server } from 'socket.io'
import http from 'http'
import flash from 'connect-flash'
import Chat from './models/chats'

mongoose.connect(config.db)
const db = mongoose.connection

db.on("error", () => console.error("Connection error!"))
db.once("open", () => console.log("Connected successfully"))

const app: Express = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieparser());

const server = http.createServer(app)
const io = new Server(server)

const mongoDBStore = mongdDBSession(session);
const store = new mongoDBStore({
    uri: config.db,
    collection: 'sessions'
})

store.on('error', function (error) {
    console.log(error)
});

app.use(session({
    secret: config.session_secret,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
    },
    store: store,
    resave: false
}));

app.use(flash())

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        res.locals.authenticated = true;
        res.locals.authUser = req.session.user;
    } else {
        res.locals.authenticated = false;
    }

    next();
})

app.use(express.static(path.join(path.dirname(__dirname), 'public')))

app.set('view engine', 'pug')
app.set('views', path.join(path.dirname(__dirname), 'views'))

app.use('/', authRoutes);

app.use('/home', homeRoutes);

app.all('*', (_, res: Response) => {
    res.render('404')
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', async ({ message, connectionId, senderId }) => {
        await Chat.create({ message, connectionId, senderId });
        io.in(connectionId).emit('message', { message, connectionId, senderId })
    });

    socket.on('join', (arg, callback) => {
        socket.join(arg.connId);
        callback(`joined ${arg.connId} by ${arg.username}`)
    })
})

const APP_PORT = config.app_port || 4000
server.listen(APP_PORT, () => console.log(`Server started at port ${APP_PORT}`))
