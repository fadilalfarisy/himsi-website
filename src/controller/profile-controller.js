import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadImages = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            status: 400,
            message: 'failed',
            info: 'please upload image'
        });
    }

    const path = req.file.path
    res.json({
        path: path
    })
}

const getImages = (req, res, next) => {

}

const getImagesById = (req, res, next) => {

}

const editImages = (req, res, next) => {

}

const deleteImages = (req, res, next) => {
    try {
        const imagePath = path.join(__dirname, '../../public/images/', req.params.id)
        fs.unlink(imagePath, (err) => { console.log(err) })
        res.status(200).json({
            status: 200,
            message: 'success',
            info: 'deleted image successfully'
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }

}

const profileController = {
    uploadImages,
    getImages,
    getImagesById,
    editImages,
    deleteImages,
}

export default profileController