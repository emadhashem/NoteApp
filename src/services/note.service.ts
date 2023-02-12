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
export const sendNewNote = async ({ title, msg, recipients, type, userId }: CreateNoteSchemaInputType & { userId: string }) => {
    const owner = await findUserById(userId)
    const newNote = noteRepo.create({
        title, msg, note: {
            type,
        },
        user: owner
    })
    await noteRepo.save(newNote)
    let recivers: RecivedNote[] = []
    let ok = true
    for (let i = 0; i < recipients.length; i++) {
        const userEmail = recipients[i]
        const user = await findUserByEmail(userEmail)
        if (!user) {
            ok = false
            break
        }
        const newRecivedNote = recivedNoteRepo.create({
            note: newNote,
            reciver: user
        })
        recivers.push(newRecivedNote)
    }

    if (!ok) throw new AppError(400, 'there are some users not found')
    newNote.recived_notes = recivers
    await noteRepo.save(newNote)
    return newNote
}

export const softDeleteNotes = async (
    notes: string[], reciverId: string
) => {

    const qb = recivedNoteRepo.createQueryBuilder('r_note')
        .softDelete()
        .where("reciver_id = :id", { id: reciverId })
        .andWhere("note_id IN(:...ids) and deleted_at = null", { ids: notes })
    const { affected } = await qb.execute()
    return affected
}
const _30days = 30 * 60 * 60 * 1000;
export const getNotesInLast30Days = async (
    limit: number, skip: number, types: string[], user : string
) => {
    const curDate = new Date()
    const last30DaysDate = curDate.getTime() - _30days
    curDate.setTime(last30DaysDate)
    const qb = noteRepo.createQueryBuilder('note_')
    .innerJoinAndSelect(RecivedNote , 'recived_note' , "recived_note.note_id = note_.id")
    .where("note_.note_type IN(:...types)" , {types})
    .andWhere("note_.created_at >= :date" , {date : curDate})
    .andWhere("recived_note.reciver_id = :user" , {user})
    .andWhere("recived_note.deleted_at IS null")
    .select([
        'note_.id AS id',
        'note_.note_type AS type',
        'note_.title AS title',
        'note_.msg AS msg',
        'note_.media AS media',
        'note_.note_disabled AS disabled',
        'note_.created_at AS created_at',
        'note_.user_id AS sender', 
    ])
    return await qb.offset(skip).limit(limit).execute()
}
