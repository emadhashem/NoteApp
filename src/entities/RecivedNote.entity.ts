import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Note } from "./Note.entity";
import { User } from "./User.entity";


@Entity('recived_notes')
export class RecivedNote {

    @PrimaryGeneratedColumn('increment')
    id : number

    @ManyToOne(() => User , user => user.recived_notes , {onDelete : 'CASCADE' , cascade : ['update']})
    @JoinColumn({
        name : 'reciver_id'
    })
    reciver : User
    
    @DeleteDateColumn()
    deleted_at : Date
    @ManyToOne(() => Note , note => note.recived_notes , {onDelete : 'CASCADE'})
    @JoinColumn({
        name : 'note_id'
    })
    note : Note
    

}