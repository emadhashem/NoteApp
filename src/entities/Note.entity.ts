import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NoteType } from "./NoteType.entity";
import { RecivedNote } from "./RecivedNote.entity";
import { User } from "./User.entity";

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn("uuid")
    id : string
    
    @Column()
    title : string

    @Column()
    msg : string

    @Column(() => NoteType)
    note : NoteType

    @Column({nullable : true})
    media : string

    @CreateDateColumn()
    created_at : Date

    @ManyToOne(() => User , user => user.notes , {onDelete : 'CASCADE' , cascade : ['update']})
    @JoinColumn({
        name : 'user_id'
    })
    user : User
    
    @OneToMany(() => RecivedNote , note => note.note , {cascade : true})
    recived_notes : RecivedNote[]
}