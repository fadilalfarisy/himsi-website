import express from "express"
import multer from "multer"
import himpunanController from '../controller/himpunan-controller.js'
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

const upload = multer({ storage: filestorage, fileFilter: fileFilter })

const himpunan = express.Router()

himpunan.get('/himpunan', himpunanController.getHimpunan)
himpunan.put('/himpunan', auth, upload.fields([
    { name: 'gambar_struktur', maxCount: 1 },
    { name: 'logo_himpunan', maxCount: 1 }
]), himpunanController.saveHimpunan)
himpunan.delete('/himpunan/:id', auth, himpunanController.deleteHimpunan)

export default himpunan