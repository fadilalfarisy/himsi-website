import express from "express"
import multer from "multer"
import beritaController from '../controller/berita-controller.js'

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

const berita = express.Router()

berita.get('/berita/', beritaController.getBerita)
berita.get('/berita/:id', beritaController.getBeritaById)
berita.post('/berita', upload.fields([
    { name: 'header_berita', maxCount: 1 },
    { name: 'gambar_berita', maxCount: 1 }
]), beritaController.createBerita)
berita.put('/berita/:id', upload.fields([
    { name: 'header_berita', maxCount: 1 },
    { name: 'gambar_berita', maxCount: 1 }
]), beritaController.editBerita)
berita.delete('/berita/:id', beritaController.deleteBerita)

export default berita