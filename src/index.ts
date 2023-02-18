import { AppDataSource } from "./data-source"
import express , {Express, NextFunction, Request, Response} from 'express'
import cors from 'cors'
require('dotenv').config();
import morgan from 'morgan'
import config from 'config'
import { AppError } from "./utils/AppError";
import authRoute from './routes/auth.route'
import noteRoute from './routes/note.route'
import uploadroute from './routes/test.route'
import {Server} from 'socket.io'
import http from 'http'
import path from "path";
import * as url from 'url';
const app : Express = express()
const server = http.createServer(app)
const io = new Server(server)

AppDataSource.initialize()
.then(async () => {
    // html
    app.use(express.static(path.join(path.dirname(__filename) , 'public')))
    // body parser
    app.use(express.json())
    // cors
    app.use(cors({origin : '*'}))
    // logger
    app.use(morgan("dev"))  

    // routes
    app.use('/api/auth' , authRoute)
    app.use('/api/note' , noteRoute)
    app.use('/api' , uploadroute)
    // handle not existing routes
    app.all('*' , (req , res , next: NextFunction) => {
        return next(new AppError(404 , `this route ${req.originalUrl} not found`))
    })
    // global error
    app.use((err : AppError , _req : Request , res : Response , _next : NextFunction) => {
        err.status = err.status || 'error'
        err.statusCode = err.statusCode || 500
        res.status(err.statusCode).send({
            status : err.status,
            message : err.message
        })
    })
    // io setup
    io.on('connection' , (socket) => {
        socket.on('send_note' , (recivers : string[] , note) => {
            recivers.forEach(user_email => {
                socket.emit(user_email , note)
            })
        })
    })
    // connect server
    const port = config.get<number>('port')
    server.listen(port , () => {
        console.log(`app is listening on port ${port}`)
    })
})
.catch(error => console.log("db error:(\n" , error))


