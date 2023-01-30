
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Note } from "./Note.entity";
import { RecivedNote } from "./RecivedNote.entity";
import bycrpt from 'bcrypt'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn("uuid")
    id : string
    @Column()
    name : string
    @Column({nullable : true})
    photo : string
    @Column({unique : true})
    email : string
    @Column()
    password : string

    @OneToMany(() => Note , note => note.user , {cascade : true})
    notes : Note[]

    @OneToMany(() => RecivedNote, note => note.reciver, {cascade : true})
    recived_notes : RecivedNote[]

    @BeforeInsert()
    async hashPass() {
        this.password = await bycrpt.hash(this.password , 12)
    }
    static async comparePass(candidatePass : string , hashedPass : string) {
        return await bycrpt.compare(candidatePass , hashedPass)
    }
}