import { AppDataSource } from "./data-source"
import express , {Express, NextFunction, Request, Response} from 'express'
import cors from 'cors'
require('dotenv').config();
import morgan from 'morgan'
import config from 'config'
import { AppError } from "./utils/AppError";
import authRoute from './routes/auth.route'
import noteRoute from './routes/note.route'

const app : Express = express()


AppDataSource.initialize()
.then(async () => {
    // body parser
    app.use(express.json())
    // cors
    app.use(cors({origin : '*'}))
    // logger
    app.use(morgan("dev"))  

    // routes
    app.use('/api/auth' , authRoute)
    app.use('/api/note' , noteRoute)

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
    // connect server
    const port = config.get<number>('port')
    app.listen(port , () => {
        console.log(`app is listening on port ${port}`)
    })
})
.catch(error => console.log("db error:(\n" , error))


