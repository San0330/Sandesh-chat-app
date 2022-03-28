import dotenv from "dotenv"

dotenv.config()

const config = {
    app_name: process.env.APP_NAME,
    app_url: process.env.APP_URL,
    app_port: process.env.APP_PORT,
    db: process.env.DB_URI,
    session_secret:process.env.SESSION_SECRET
}

export default config