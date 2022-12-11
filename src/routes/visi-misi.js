import express from "express"
import multer from "multer"
import visiController from '../controller/visi-controller.js'

//config images storage
const filestorage = multer.diskStorage({
    //path images storage
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    //named the image file
    filename: (req, file, cb) => {
        cb(null, file.originalname.trim())
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

const upload = multer({ storage: filestorage, fileFilter: fileFilter })

const visiMisi = express.Router()

visiMisi.get('/visi', visiController.getVisi)
visiMisi.get('/visi/:id', visiController.getVisiById)
visiMisi.post('/visi', upload.single('image'), visiController.createVisi)
visiMisi.put('/visi/:id', upload.single('image'), visiController.editVisi)
visiMisi.delete('/visi/:id', visiController.deleteVisi)

export default visiMisi