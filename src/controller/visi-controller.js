import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import Visi from "../model/visi-misi.js"

const createVisi = async (req, res, next) => {
    const {
        visi,
        misi,
        angkatan } = req.body
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }
        const pathVisi = req.file.path

        const newVisi = await Visi.create({
            visi,
            misi,
            gambar: pathVisi,
            angkatan
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newVisi
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

const getVisi = async (req, res, next) => {
    try {
        const visi = await Visi.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: visi
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

const getVisiById = async (req, res, next) => {
    const { id } = req.params
    try {
        const visi = await Visi.findOne({ _id: id })
        if (!visi) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'visi not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: visi
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


const editVisi = async (req, res, next) => {
    const { id } = req.params
    const {
        visi,
        misi,
        angkatan } = req.body
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const existingVisi = await Visi.findOne({ _id: id })
        if (!existingVisi) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'visi not found'
            });
        }
        const imagePath = path.join(__dirname, '../../', existingVisi.gambar)
        fs.unlink(imagePath, (err) => { console.log(err) })

        const pathVisi = req.file.path
        const updatedVisi = await Visi.updateOne({ _id: id }, {
            $set: {
                visi,
                misi,
                angkatan,
                gambar: pathVisi
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: updatedVisi
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

const deleteVisi = async (req, res, next) => {
    const { id } = req.params
    try {
        const visi = await Visi.findOne({ _id: id })
        if (!visi) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'visi not found'
            });
        }
        const imagePath = path.join(__dirname, '../../', visi.gambar)
        fs.unlink(imagePath, (err) => { console.log(err) })

        const deletedVisi = await Visi.deleteOne({ _id: id })
        if (deletedVisi.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'divisi not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: deletedVisi
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const visiController = {
    createVisi,
    getVisi,
    getVisiById,
    editVisi,
    deleteVisi,
}

export default visiController