import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import Himpunan from "../model/himpunan.js"
import cloudinary from '../libs/cloudinary.js';

const saveHimpunan = async (req, res, next) => {
    const {
        nama_himpunan,
        nama_universitas
    } = req.body
    try {
        if (!req.files.gambar_struktur || !req.files.logo_himpunan) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const {
            gambar_struktur: [{ path: pathGambarStruktur }],
            logo_himpunan: [{ path: pathLogoHimpunan }],
        } = req.files

        const existingHimpunan = await Himpunan.findOne()
        if (!existingHimpunan) {
            await Himpunan.create({
                nama_himpunan,
                nama_universitas,
                gambar_struktur: '',
                logo_himpunan: '',
            });
        } else {
            if (existingHimpunan.gambar_struktur || existingHimpunan.logo_himpunan) {

                //delete old images
                cloudinary.uploader.destroy(existingHimpunan.gambar_struktur.public_id)
                    .then(result => console.log(result))
                cloudinary.uploader.destroy(existingHimpunan.logo_himpunan.public_id)
                    .then(result => console.log(result))

                // const oldPathGambarStruktur = path.join(__dirname, '../../', existingHimpunan.gambar_struktur)
                // const oldPathLogoHimpunan = path.join(__dirname, '../../', existingHimpunan.logo_himpunan)

                // fs.unlink(oldPathGambarStruktur, (err) => {
                //     if (err) {
                //         return res.status(400).json({
                //             status: 400,
                //             message: 'failed',
                //             info: 'failed to edit himpunan'
                //         });
                //     }
                // })
                // fs.unlink(oldPathLogoHimpunan, (err) => {
                //     if (err) {
                //         return res.status(400).json({
                //             status: 400,
                //             message: 'failed',
                //             info: 'failed to edit himpunan'
                //         });
                //     }
                // })
            }
        }

        const uploadGambarStruktur = await cloudinary.uploader.upload(pathGambarStruktur)
        const uploadLogoHimpunan = await cloudinary.uploader.upload(pathLogoHimpunan)

        await Himpunan.updateOne({}, {
            $set: {
                nama_himpunan,
                nama_universitas,
                gambar_struktur: {
                    public_id: uploadGambarStruktur.public_id,
                    url: uploadGambarStruktur.secure_url
                },
                logo_himpunan: {
                    public_id: uploadLogoHimpunan.public_id,
                    url: uploadLogoHimpunan.secure_url
                },
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully save himpunan'
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

const getHimpunan = async (req, res, next) => {
    try {
        const himpunan = await Himpunan.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: himpunan
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

const deleteHimpunan = async (req, res, next) => {
    const { id } = req.params
    try {
        const himpunan = await Himpunan.findOne({ _id: id })
        if (!himpunan) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'himpunan not found'
            });
        }

        if (himpunan.gambar_struktur || himpunan.logo_himpunan) {

            //delete old images
            cloudinary.uploader.destroy(himpunan.gambar_struktur.public_id)
                .then(result => console.log(result))
            cloudinary.uploader.destroy(himpunan.logo_himpunan.public_id)
                .then(result => console.log(result))

            // const pathGambarStruktur = path.join(__dirname, '../../', himpunan.gambar_struktur)
            // const pathLogoHimpunan = path.join(__dirname, '../../', himpunan.logo_himpunan)
            // fs.unlink(pathGambarStruktur, (err) => {
            //     if (err) {
            //         return res.status(400).json({
            //             status: 400,
            //             message: 'failed',
            //             info: 'failed to deleted himpunan'
            //         });
            //     }
            // })
            // fs.unlink(pathLogoHimpunan, (err) => {
            //     if (err) {
            //         return res.status(400).json({
            //             status: 400,
            //             message: 'failed',
            //             info: 'failed to deleted himpunan'
            //         });
            //     }
            // })
        }

        await Himpunan.deleteOne({ _id: id })

        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted himpunan'
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

const himpunanController = {
    saveHimpunan,
    getHimpunan,
    deleteHimpunan,
}

export default himpunanController