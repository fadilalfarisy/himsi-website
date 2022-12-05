import express from "express"
import multer from "multer"
import profileController from '../controller/profile-controller.js'

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

const router = express.Router()

router.get('/images/:id', profileController.getImagesById)
router.post('/images', upload.single('image'), profileController.uploadImages)
router.put('/images/:id', upload.single('image'), profileController.editImages)
router.delete('/images/:id', profileController.deleteImages)

export default router