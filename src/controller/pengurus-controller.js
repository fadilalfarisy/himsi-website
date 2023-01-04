import fs from 'fs';
import path from 'path'
import {
    fileURLToPath
} from 'url'
const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)
import Pengurus from "../model/pengurus.js"
import cloudinary from '../libs/cloudinary.js'

const createPengurus = async (req, res, next) => {
    const {
        nama_pengurus,
        jabatan,
        media_social,
        id_bidang
    } = req.body
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const {
            path: pathFotoPengurus
        } = req.file

        const uploadFotoPengurus = await cloudinary.uploader.upload(pathFotoPengurus)

        const newPengurus = await Pengurus.create({
            nama_pengurus,
            jabatan,
            media_social,
            id_bidang,
            foto_pengurus: {
                public_id: uploadFotoPengurus.public_id,
                url: uploadFotoPengurus.secure_url
            }
        });

        res.status(200).json({
            status: 200,
            message: 'success',
            data: newPengurus
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

const getPengurus = async (req, res, next) => {
    try {
        let {
            bidang
        } = req.query;
        let query = {}

        if (bidang) {
            query = {
                ...query,
                $or: [{
                    'judul_berita': {
                        $regex: bidang,
                        $options: "i"
                    },
                }, {
                    'isi_berita': {
                        $regex: bidang,
                        $options: "i"
                    },
                }]
            }
        }

        let pengurus = await Pengurus.aggregate([{
            $match: query
        }, ])

        res.status(200).json({
            status: 200,
            message: 'success',
            data: pengurus
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

const getPengurusById = async (req, res, next) => {
    const {
        id
    } = req.params
    try {
        const pengurus = await Pengurus.findOne({
            _id: id
        })
        if (!pengurus) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'pengurus not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: pengurus
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


const editPengurus = async (req, res, next) => {
    const {
        id
    } = req.params
    const {
        nama_pengurus,
        jabatan,
        media_social,
        id_bidang
    } = req.body

    let foto_pengurus, public_id_foto_pengurus = ''

    try {

        const existingPengurus = await Pengurus.findOne({
            _id: id
        })
        if (!existingPengurus) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'pengurus not found'
            });
        }

        //when foto pengurus not updated
        if (!req.file) {
            foto_pengurus = existingPengurus.foto_pengurus.url
            public_id_foto_pengurus = existingPengurus.foto_pengurus.public_id
            console.log('without update foto pengurus')
            //when foto pengurus is updated
        } else {
            const {
                path: pathFotoPengurus
            } = req.file

            //delete old images
            cloudinary.uploader.destroy(existingPengurus.foto_pengurus.public_id)
                .then(result => console.log(result))
            //save new images
            const uploadFotoPengurus = await cloudinary.uploader.upload(pathFotoPengurus)

            foto_pengurus = uploadFotoPengurus.secure_url
            public_id_foto_pengurus = uploadFotoPengurus.public_id
            console.log('updated foto pengurus')
        }


        // const oldpathGambarBerita = path.join(__dirname, '../../', existingBerita.gambar_berita)
        // const oldpathHeaderBerita = path.join(__dirname, '../../', existingBerita.header_berita)

        // fs.unlink(oldpathGambarBerita, (err) => {
        //     if (err) {
        //         return res.status(400).json({
        //             status: 400,
        //             message: 'failed',
        //             info: 'failed to edit berita'
        //         });
        //     }
        // })
        // fs.unlink(oldpathHeaderBerita, (err) => {
        //     if (err) {
        //         return res.status(400).json({
        //             status: 400,
        //             message: 'failed',
        //             info: 'failed to edit berita'
        //         });
        //     }
        // })

        await Pengurus.updateOne({
            _id: id
        }, {
            $set: {
                nama_pengurus,
                jabatan,
                media_social,
                id_bidang,
                foto_pengurus: {
                    public_id: public_id_foto_pengurus,
                    url: foto_pengurus
                },
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited pengurus'
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

const deletePengurus = async (req, res, next) => {
    const {
        id
    } = req.params
    try {
        const pengurus = await Pengurus.findOne({
            _id: id
        })
        if (!pengurus) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'pengurus not found'
            });
        }

        //delete image
        cloudinary.uploader.destroy(pengurus.foto_pengurus.public_id)
            .then(result => console.log(result))

        // const pathGambarBerita = path.join(__dirname, '../../', berita.gambar_berita)
        // const pathHeaderBerita = path.join(__dirname, '../../', berita.header_berita)
        // fs.unlink(pathHeaderBerita, (err) => {
        //     if (err) {
        //         return res.status(400).json({
        //             status: 400,
        //             message: 'failed',
        //             info: 'failed to delete berita'
        //         });
        //     }
        // })
        // fs.unlink(pathGambarBerita, (err) => {
        //     if (err) {
        //         return res.status(400).json({
        //             status: 400,
        //             message: 'failed',
        //             info: 'failed to edit berita'
        //         });
        //     }
        // })

        const deletedPengurus = await Pengurus.deleteOne({
            _id: id
        })
        if (deletedPengurus.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'pengurus not found'
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted pengurus'
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

const pengurusController = {
    createPengurus,
    getPengurus,
    getPengurusById,
    editPengurus,
    deletePengurus,
}

export default pengurusController