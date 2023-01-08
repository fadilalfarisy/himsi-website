import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import Slider from "../model/slider-information.js"

const createSlider = async (req, res, next) => {
    const {
        judul,
        link} = req.body
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }
        const pathSlider = req.file.path

        const newSlider = await Slider.create({
            gambar_slider: pathSlider,
            judul,
            link
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newSlider
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const getSlider = async (req, res, next) => {
    try {
        const slider = await Slider.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: slider
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const getSliderById = async (req, res, next) => {
    const { id } = req.params
    try {
        const slider = await Slider.findOne({ _id: id })
        if (!slider) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'slider not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: slider
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}


const editSlider = async (req, res, next) => {
    const { id } = req.params
    const {
        judul,
        link} = req.body
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const existingSlider = await Slider.findOne({ _id: id })
        if (!existingSlider) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'slider not found'
            });
        }
        const imagePath = path.join(__dirname, '../../', existingSlider.gambar)
        fs.unlink(imagePath, (err) => { console.log(err) })

        const pathSlider = req.file.path
        const updatedSlider = await Slider.updateOne({ _id: id }, {
            $set: {
                gambar_slider: pathSlider,
                judul,
                link
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: updatedSlider
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const deleteSlider = async (req, res, next) => {
    const { id } = req.params
    try {
        const slider = await Slider.findOne({ _id: id })
        if (!slider) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'slider not found'
            });
        }
        const imagePath = path.join(__dirname, '../../', slider.gambar)
        fs.unlink(imagePath, (err) => { console.log(err) })

        const deletedSlider = await Slider.deleteOne({ _id: id })
        if (deletedSlider.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'slider not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: deletedSlider
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const sliderController = {
    createSlider,
    getSlider,
    getSliderById,
    editSlider,
    deleteSlider,
}

export default sliderController