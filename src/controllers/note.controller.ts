import { NextFunction, Request, Response } from "express";
import { NoteTypes } from "../entities/NoteType.entity";
import { CreateNoteSchemaInputType, DeleteNoteSchemaInputType } from "../schemas/note.schema";
import { getNotesInLast30Days, sendNewNote, softDeleteNotes } from "../services/note.service";
import { AppError } from "../utils/AppError";
import { validNumber } from "../utils/helper";

export const sendNoteHandler = async (
    req: Request<{}, {}, CreateNoteSchemaInputType>, res: Response, next: NextFunction
) => {
    try {
        const { title,
            msg,
            type,
            recipients } = req.body
        const newNote = await sendNewNote({ title, msg, type, recipients , userId : res.locals.user })    
        res.send(newNote)
    } catch (error) {
        next(error)
    }
}

export const deleteNotesHandler = async (
    req: Request<{}, {}, DeleteNoteSchemaInputType>,
    res: Response, next: NextFunction
) => {
    try {
        const affected = await softDeleteNotes(req.body.notes , res.locals.user)
        res.send({
            status : 'success',
            data : {
                affected 
            }
        })
    } catch (error) {
        next(new AppError(400 , 'some notes are note found'))
    }
}

export const getNotesInTheLast30DaysHandler = async (
    req : Request<{} , {} , {} , {limit : string , skip : string , types : string}>, 
    res : Response<{} , {user : string}>, 
    next : NextFunction
) => {
    try {
        const {user} = res.locals
        let {limit , skip , types} = req.query
        if(!validNumber(limit) || !validNumber(skip)) {
            return next(new AppError(400 , 'limit or skip are not valid'))
        }
        let limit_ = parseInt(limit)
        let skip_ = parseInt(skip)
        let types_ = types.split(',')
        for(let i of types_) {
            if(i in NoteTypes) continue
            return next(new AppError(400 , 'some types are not valid'))
        }
        const notes = await getNotesInLast30Days(limit_ , skip_ , types_ , user)
        res.send({
            status : 'success',
            data : {
                notes
            }
        })
    } catch (error) {
        next(error)
    }
}

