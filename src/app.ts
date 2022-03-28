import config from './config/config'
import path from 'path'
import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/web/auth_routes'
import cookieparser from 'cookie-parser'
import session from 'express-session'
import mongdDBSession from 'connect-mongodb-session'

mongoose.connect(config.db)
const db = mongoose.connection

db.on("error", () => console.error("Connection error!"))
db.once("open", () => console.log("Connected successfully"))

const app: Express = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieparser());

const mongoDBStore = mongdDBSession(session);
const store = new mongoDBStore({
    uri: 'mongodb://bad.host:27000/connect_mongodb_session_test?connectTimeoutMS=10',
    databaseName: 'connect_mongodb_session_test',
    collection: 'mySessions'
})

store.on('error', function (error) {
    console.log(error)
});

app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
    },
    store: store,
    resave: false
}));

app.use(express.static(path.join(path.dirname(__dirname), 'public')))

app.set('view engine', 'pug')
app.set('views', path.join(path.dirname(__dirname), 'views'))

app.get('/', (req: Request, res: Response) => {
    res.render('home')
});

app.use('/', authRoutes);

app.all('*', (_, res: Response) => {
    res.render('404')
})

const APP_PORT = config.app_port || 4000
app.listen(APP_PORT, () => console.log(`Server started at port ${APP_PORT}`))
