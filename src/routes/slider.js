import express from "express"
import multer from "multer"
import sliderController from '../controller/slider-controller.js'

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

const sliderInformation = express.Router()

sliderInformation.get('/slider', sliderController.getSlider)
sliderInformation.get('/slider/:id', sliderController.getSliderById)
sliderInformation.post('/slider', upload.single('image'), sliderController.createSlider)
sliderInformation.put('/slider/:id', upload.single('image'), sliderController.editSlider)
sliderInformation.delete('/slider/:id', sliderController.deleteSlider)

export default sliderInformation