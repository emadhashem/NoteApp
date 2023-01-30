import { AppDataSource } from "../data-source";
import { Note } from "../entities/Note.entity";
import { RecivedNote } from "../entities/RecivedNote.entity";
import { User } from "../entities/User.entity";
import { CreateNoteSchemaInputType } from "../schemas/note.schema";
import { AppError } from "../utils/AppError";
import { findUserByEmail, findUserById } from "./user.service";
const noteRepo = AppDataSource.getRepository(Note)
const recivedNoteRepo = AppDataSource.getRepository(RecivedNote)
const userRepo = AppDataSource.getRepository(User)
export const sendNewNote = async ({title , msg , recipients , type , userId} : CreateNoteSchemaInputType & {userId : string}) => {
    const owner = await findUserById(userId)
    const newNote = noteRepo.create({
        title , msg , note : {
            type,
        },
        user : owner
    })

    await noteRepo.save(newNote)
    let recivers : RecivedNote[] = []
    let ok = true
    for(let i = 0; i < recipients.length; i++) {
        const userEmail = recipients[i]
        const user = await findUserByEmail(userEmail)
        if(!user) {
            ok = false
            break 
        }
        const newRecivedNote = recivedNoteRepo.create({
            note : newNote,
            reciver : user
        })
        recivers.push(newRecivedNote)
    }
    
    if(!ok) throw new AppError(400 , 'there are some users not found')
    newNote.recived_notes = recivers
    await noteRepo.save(newNote)
    return newNote
}