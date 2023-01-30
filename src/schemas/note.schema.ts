import { TypeOf, z } from "zod";
import { NoteTypes } from "../entities/NoteType.entity";

export const createNoteSchema = z.object({
    body : z.object({
        title : z.string().min(2),
        msg : z.string().min(2),
        type : z.nativeEnum(NoteTypes),
        recipients : z.string().array()
    })
})

export const getNotesInLast30DaysSchema = z.object({
    query : z.object({
        limit : z.number(),
        skip : z.number(),
        types : z.string().array()
    })
})
export const deleteNotesSchema = z.object({
    body : z.object({
        notes : z.string().array()
    })
})
export type CreateNoteSchemaInputType = TypeOf <typeof createNoteSchema>['body']
export type GetNotesInLast30DaysSchemaInputType = TypeOf <typeof getNotesInLast30DaysSchema>['query']
export type DeleteNoteSchemaInputType = TypeOf <typeof deleteNotesSchema>['body']

