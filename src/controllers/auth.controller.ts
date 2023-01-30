import { NextFunction, Request, Response } from "express";
import { CreateUserInputType, LoginUserInputType } from "../schemas/user.schema";
import { createNewUser, findUserByEmail } from "../services/user.service";
import { AppError } from "../utils/AppError";
import {User} from '../entities/User.entity'
export const registerHandler = async (
    req : Request<{} , {} , CreateUserInputType>, res : Response, next : NextFunction
) => {
    try {
        const newUser = await createNewUser(req.body)
        
        res.status(201)
        .send({
            status : 'success',
            data : {
                user : newUser
            }
        })
    } catch (err) {
        if (err.code === 23505) {
            return res.status(409).json({
                status: 'fail',
                message: 'this email already in use'
            })
        }
        next(err)
    }
}

export const loginHandler = async (
    req : Request<{} , {} , LoginUserInputType>, res : Response, next : NextFunction
) => {
    try {
        const {email , password} = req.body
        const user = await findUserByEmail(email)
        if(!user || !(await User.comparePass(password, user.password))) {
            return next(new AppError(400 , 'email or password not valid'))
        }
        res.send({
            status : 'success'
        })
    } catch (error) {
        next(error)
    }
}