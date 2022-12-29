import express from "express"
import multer from "multer"
import eventController from '../controller/event-controller.js'

//config images storage
const filestorage = multer.diskStorage({
    //path images storage
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    //named the image file
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
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

const event = express.Router()

event.get('/event/', eventController.getEvent)
event.get('/event/:id', eventController.getEventById)
event.post('/event', upload.fields([
    { name: 'header_event', maxCount: 1 },
    { name: 'gambar_event', maxCount: 1 }
]), eventController.createEvent)
event.put('/event/:id', upload.fields([
    { name: 'header_event', maxCount: 1 },
    { name: 'gambar_event', maxCount: 1 }
]), eventController.editEvent)
event.delete('/event/:id', eventController.deleteEvent)

export default event