import express from "express"
import multer from "multer"
import pengurusController from '../controller/pengurus-controller.js'
import auth from '../middleware/auth-user.js'

//config images storage
const filestorage = multer.diskStorage({
    //path images storage
    // destination: (req, file, cb) => {
    //     cb(null, './public/images')
    // },
    //named the image file
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

//allow image with format jpeg, jpg, or png only
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
    ) {
        cb(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({
    storage: filestorage,
    fileFilter: fileFilter
})

const pengurus = express.Router()

pengurus.get('/pengurus/', pengurusController.getPengurus)
pengurus.get('/pengurus/:id', pengurusController.getPengurusById)
pengurus.post('/pengurus', auth, upload.single('foto_pengurus'), pengurusController.createPengurus)
pengurus.put('/pengurus/:id', auth, upload.single('foto_pengurus'), pengurusController.editPengurus)
pengurus.delete('/pengurus/:id', auth, pengurusController.deletePengurus)

export default pengurus