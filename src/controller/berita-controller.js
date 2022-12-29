import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import Berita from "../model/berita.js"
import berita from '../routes/berita.js';

const createBerita = async (req, res, next) => {
    const {
        judul,
        tanggal,
        content,
        penulis,
        link } = req.body
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }
        const pathBerita = req.file.path

        const newBerita = await Berita.create({
            judul,
            tanggal,
            content,
            penulis,
            link,
            gambar_berita: pathBerita,
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newBerita
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

const getBerita = async (req, res, next) => {
    try {
        const berita = await Berita.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: berita
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

const getBeritaById = async (req, res, next) => {
    const { id } = req.params
    try {
        const berita = await Berita.findOne({ _id: id })
        if (!berita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: berita
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


const editBerita = async (req, res, next) => {
    const { id } = req.params
    const {
        judul,
        tanggal,
        content,
        penulis,
        link } = req.body
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const existingBerita = await Berita.findOne({ _id: id })
        if (!existingBerita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }
        const imagePath = path.join(__dirname, '../../', existingBerita.gambar_berita)
        fs.unlink(imagePath, (err) => { console.log(err) })

        const pathBerita = req.file.path
        const updatedBerita = await Berita.updateOne({ _id: id }, {
            $set: {
                judul,
                tanggal,
                content,
                penulis,
                link,
                gambar_berita: pathBerita
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: updatedBerita
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

const deleteBerita = async (req, res, next) => {
    const { id } = req.params
    try {
        const berita = await Berita.findOne({ _id: id })
        if (!berita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }
        const imagePath = path.join(__dirname, '../../', berita.gambar_berita)
        fs.unlink(imagePath, (err) => { console.log(err) })

        const deletedBerita = await Berita.deleteOne({ _id: id })
        if (deletedBerita.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: deletedBerita
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const beritaController = {
    createBerita,
    getBerita,
    getBeritaById,
    editBerita,
    deleteBerita,
}

export default beritaController