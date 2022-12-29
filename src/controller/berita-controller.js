import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import Berita from "../model/berita.js"

const createBerita = async (req, res, next) => {
    const {
        judul_berita,
        tanggal_berita,
        isi_berita,
        penulis_berita,
        link_berita } = req.body
    try {
        if (!req.files.header_berita || !req.files.gambar_berita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }
        const {
            header_berita: [{ path: pathHeaderBerita }],
            gambar_berita: [{ path: pathGambarBerita }],
        } = req.files

        const newBerita = await Berita.create({
            judul_berita,
            tanggal_berita,
            isi_berita,
            penulis_berita,
            link_berita,
            header_berita: pathHeaderBerita,
            gambar_berita: pathGambarBerita,
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
        let { search } = req.query;
        let query = {}

        if (search) {
            query = {
                ...query,
                $or: [{
                    'judul_berita': {
                        $regex: search,
                        $options: "i"
                    },
                }, {
                    'isi_berita': {
                        $regex: search,
                        $options: "i"
                    },
                }]
            }
        }

        let berita = await Berita.aggregate([{
            $match: query
        },])

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
        judul_berita,
        tanggal_berita,
        isi_berita,
        penulis_berita,
        link_berita,
    } = req.body
    try {
        if (!req.files.header_berita || !req.files.gambar_berita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const {
            header_berita: [{ path: pathHeaderBerita }],
            gambar_berita: [{ path: pathGambarBerita }],
        } = req.files

        const existingBerita = await Berita.findOne({ _id: id })
        if (!existingBerita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }

        const oldpathGambarBerita = path.join(__dirname, '../../', existingBerita.gambar_berita)
        const oldpathHeaderBerita = path.join(__dirname, '../../', existingBerita.header_berita)

        fs.unlink(oldpathGambarBerita, (err) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: 'failed to edit berita'
                });
            }
        })
        fs.unlink(oldpathHeaderBerita, (err) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: 'failed to edit berita'
                });
            }
        })

        await Berita.updateOne({ _id: id }, {
            $set: {
                judul_berita,
                tanggal_berita,
                isi_berita,
                penulis_berita,
                link_berita,
                header_berita: pathHeaderBerita,
                gambar_berita: pathGambarBerita,
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited berita'
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
        const pathGambarBerita = path.join(__dirname, '../../', berita.gambar_berita)
        const pathHeaderBerita = path.join(__dirname, '../../', berita.header_berita)
        fs.unlink(pathHeaderBerita, (err) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: 'failed to delete berita'
                });
            }
        })
        fs.unlink(pathGambarBerita, (err) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: 'failed to edit berita'
                });
            }
        })

        const deletedBerita = await Berita.deleteOne({ _id: id })
        if (deletedBerita.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted berita'
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