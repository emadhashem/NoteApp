import { Router } from "express";
import { deleteNotesHandler, sendNoteHandler } from "../controllers/note.controller";
import { requiredUser } from "../middlewares/requireduser.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createNoteSchema, deleteNotesSchema } from "../schemas/note.schema";
const router = Router()

// send note to one or more user
router.post('/send',  validate(createNoteSchema) , requiredUser , sendNoteHandler)

// get notes timeline for last 30 days with filtering by type and with pagination
router.get('/lst_30days_notes' , (req , res) => {
    res.send(req.query)
})

// delete note or more
router.delete('/delete' , validate(deleteNotesSchema) , deleteNotesHandler)

export default router
