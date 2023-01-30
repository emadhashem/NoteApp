import { Column } from "typeorm";
export enum NoteTypes {
    congrats = 'congrats',
    invitations = 'invitations',
    work = 'work',
    gym = 'gym'
}
export class NoteType {

    @Column({
        type : "enum",
        enum : NoteTypes,
        default : NoteTypes.congrats,
        name : '_type'
    })
    type : NoteTypes

    @Column({
        name : "_disabled",
        default : false
    })
    disabled : boolean
}