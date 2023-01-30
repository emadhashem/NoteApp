import { NextFunction, Request, Response } from "express";
import { findUserById } from "../services/user.service";
import { AppError } from "../utils/AppError";

export const requiredUser = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        let userId = null;
        if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer')) {
            userId = req.headers['authorization'].split(' ')[1];
        }
        if (!userId) return next(new AppError(403, 'not authorized'))
        const user = await findUserById(userId)
        if (!user) return next(new AppError(401, 'not authorized'))
        res.locals.user = userId
        next()
    }
    catch (err) {
        next(new AppError(403, 'not authorized'))
    }
}