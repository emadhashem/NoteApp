import { AppDataSource } from "../data-source";
import { User } from "../entities/User.entity";
import { CreateUserInputType } from "../schemas/user.schema";
const userRepo = AppDataSource.getRepository(User)

// add user
export const createNewUser = async (input : CreateUserInputType) => {
    return await userRepo.save(userRepo.create(input))
}

// find user by id
export const findUserById = async (id : string) => {
    return await userRepo.findOneBy({id})
}

// find user by email
export const findUserByEmail = async (email : string) => {
    return await userRepo.findOneBy({email})
}

