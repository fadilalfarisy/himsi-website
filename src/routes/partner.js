import express from "express"
import multer from "multer"
import partnerController from '../controller/partner-controller.js'
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

const partner = express.Router()

partner.get('/partner', partnerController.getPartner)
partner.get('/partner/:id', partnerController.getPartnerById)
partner.post('/partner', auth, upload.single('logo_partner'), partnerController.createPartner)
partner.put('/partner/:id', auth, upload.single('logo_partner'), partnerController.editPartner)
partner.delete('/partner/:id', auth, partnerController.deletePartner)

export default partner