import { Request, Response, Router } from "express";
import multer from 'multer'
const router = Router()
const upload = multer({dest : 'uploads/'})
router.post('/upoad_files' , upload.array('files') , uploadFiles)

function uploadFiles(req : Request , res : Response) {
    console.log(req.body);
    console.log(req.files);
    res.send({ message: "Successfully uploaded files" })
}
export default router