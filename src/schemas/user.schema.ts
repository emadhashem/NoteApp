import {z , TypeOf} from 'zod'

export const createUserSchema = z.object({
    body : z.object({ 
        name : z.string().min(3),
        email : z.string().email(),
        password : z.string().min(4)
    }).strict()
})

export const logingUserSchema = z.object({
    body : z.object({
        email : z.string().email(),
        password : z.string().min(4)
    }).strict()
})

export type CreateUserInputType = TypeOf<typeof createUserSchema>['body']
export type LoginUserInputType = TypeOf<typeof logingUserSchema>['body']