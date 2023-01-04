import fs from 'fs';
import path from 'path'
import {
    fileURLToPath
} from 'url'
const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)
import Bidang from "../model/bidang.js"
import cloudinary from '../libs/cloudinary.js'

const createBidang = async (req, res, next) => {
    const {
        nama_bidang,
        kepanjangan_bidang,
        deskripsi_bidang
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
            path: pathLogoBidang
        } = req.file

        const uploadLogoBidang = await cloudinary.uploader.upload(pathLogoBidang)

        const newBidang = await Bidang.create({
            nama_bidang,
            kepanjangan_bidang,
            deskripsi_bidang,
            logo_bidang: {
                public_id: uploadLogoBidang.public_id,
                url: uploadLogoBidang.secure_url
            }
        });

        res.status(200).json({
            status: 200,
            message: 'success',
            data: newBidang
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

const getBidang = async (req, res, next) => {
    try {
        let bidang = await Bidang.find()

        res.status(200).json({
            status: 200,
            message: 'success',
            data: bidang
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

const getBidangById = async (req, res, next) => {
    const {
        id
    } = req.params
    try {
        const bidang = await Bidang.findOne({
            _id: id
        })
        if (!bidang) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'bidang not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: bidang
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


const editBidang = async (req, res, next) => {
    const {
        id
    } = req.params
    const {
        nama_bidang,
        kepanjangan_bidang,
        deskripsi_bidang
    } = req.body

    let logo_bidang, public_id_logo_bidang = ''

    try {

        const existingBidang = await Bidang.findOne({
            _id: id
        })
        if (!existingBidang) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'bidang not found'
            });
        }

        //when logo bidang not updated
        if (!req.file) {
            logo_bidang = existingBidang.logo_bidang.url
            public_id_logo_bidang = existingBidang.logo_bidang.public_id
            console.log('without update logo bidang')
            //when logo bidang is updated
        } else {
            const {
                path: pathLogoBidang
            } = req.file

            //delete old images
            cloudinary.uploader.destroy(existingBidang.logo_bidang.public_id)
                .then(result => console.log(result))
            //save new images
            const uploadLogoBidang = await cloudinary.uploader.upload(pathLogoBidang)

            logo_bidang = uploadLogoBidang.secure_url
            public_id_logo_bidang = uploadLogoBidang.public_id
            console.log('update logo bidang')
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

        await Bidang.updateOne({
            _id: id
        }, {
            $set: {
                nama_bidang,
                kepanjangan_bidang,
                deskripsi_bidang,
                logo_bidang: {
                    public_id: public_id_logo_bidang,
                    url: logo_bidang
                },
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited bidang'
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

const deleteBidang = async (req, res, next) => {
    const {
        id
    } = req.params
    try {
        const bidang = await Bidang.findOne({
            _id: id
        })
        if (!bidang) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'bidang not found'
            });
        }

        //delete image
        cloudinary.uploader.destroy(bidang.logo_bidang.public_id)
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

        const deletedBidang = await Bidang.deleteOne({
            _id: id
        })
        if (deletedBidang.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'bidang not found'
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted bidang'
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

const bidangController = {
    createBidang,
    getBidang,
    getBidangById,
    editBidang,
    deleteBidang,
}

export default bidangController