import { NextFunction, Request, Response } from "express";
import { CreateNoteSchemaInputType, DeleteNoteSchemaInputType } from "../schemas/note.schema";
import { sendNewNote } from "../services/note.service";

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
        const { notes } = req.body
        res.send(notes)
    } catch (error) {
        next(error)
    }
}