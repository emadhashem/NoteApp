import { NextFunction, Request, Response, Router } from "express";
import { loginHandler, registerHandler } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { createUserSchema, logingUserSchema } from "../schemas/user.schema";

const router = Router()

router.post('/register', validate(createUserSchema) , registerHandler)

router.post('/login', validate(logingUserSchema) , loginHandler)



router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
    res.send('hi from logout')
})
router.get('/refresh', (req: Request, res: Response, next: NextFunction) => {
    res.send('hi from refresh')
})

export default router;