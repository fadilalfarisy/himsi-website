import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import Event from "../model/events.js"
import cloudinary from '../libs/cloudinary.js'

const createEvent = async (req, res, next) => {
    let {
        judul_event,
        tanggal_mulai_event,
        tanggal_selesai_event,
        status_event,
        kategori_event,
        isi_event,
        penulis_event,
        id_divisi } = req.body

    if (!tanggal_selesai_event) {
        tanggal_selesai_event = null
    }

    try {
        // if (!req.files.header_event || !req.files.gambar_event) {
        //     return res.status(400).json({
        //         status: 400,
        //         message: 'failed',
        //         info: 'please upload image'
        //     });
        // }

        // const {
        //     header_event: [{ path: pathHeaderEvent }],
        //     gambar_event: [{ path: pathGambarEvent }],
        // } = req.files
        let pathDokumentasiEvent = []

        const { dokumentasi_event } = req.files
        for (const element of dokumentasi_event) {
            const uploadDokumentasiEvent = await cloudinary.uploader.upload(element.path)
            pathDokumentasiEvent.push({
                public_id: uploadDokumentasiEvent.public_id,
                url: uploadDokumentasiEvent.secure_url
            })
        }

        // const newEvent = await Event.create({
        //     judul_event,
        //     tanggal_event,
        //     tanggal_akhir_event,
        //     status_event,
        //     isi_event,
        //     penulis_event,
        //     header_event: pathHeaderEvent,
        //     gambar_event: pathGambarEvent,
        // });

        res.status(200).json({
            status: 200,
            message: 'success',
            data: pathDokumentasiEvent
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

const getEvent = async (req, res, next) => {
    try {
        const event = await Event.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: event
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

const getEventById = async (req, res, next) => {
    const { id } = req.params
    try {
        const event = await Event.findOne({ _id: id })
        if (!event) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'event not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: event
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


const editEvent = async (req, res, next) => {
    const { id } = req.params
    let {
        judul_event,
        tanggal_event,
        tanggal_akhir_event,
        status_event,
        isi_event,
        penulis_event, } = req.body
    if (!tanggal_akhir_event) {
        tanggal_akhir_event = null
    }
    try {
        if (!req.files.header_event || !req.files.gambar_event) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const {
            header_event: [{ path: pathHeaderEvent }],
            gambar_event: [{ path: pathGambarEvent }],
        } = req.files

        const existingEvent = await Event.findOne({ _id: id })
        if (!existingEvent) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'event not found'
            });
        }

        const oldpathGambarEvent = path.join(__dirname, '../../', existingEvent.gambar_event)
        const oldpathHeaderEvent = path.join(__dirname, '../../', existingEvent.header_event)

        fs.unlink(oldpathGambarEvent, (err) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: 'failed to edit event'
                });
            }
        })
        fs.unlink(oldpathHeaderEvent, (err) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: 'failed to edit event'
                });
            }
        })

        await Event.updateOne({ _id: id }, {
            $set: {
                judul_event,
                tanggal_event,
                tanggal_akhir_event,
                status_event,
                isi_event,
                penulis_event,
                header_event: pathHeaderEvent,
                gambar_event: pathGambarEvent,
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited event'
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

const deleteEvent = async (req, res, next) => {
    const { id } = req.params
    try {
        const event = await Event.findOne({ _id: id })
        if (!event) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'event not found'
            });
        }
        const pathGambarEvent = path.join(__dirname, '../../', event.gambar_event)
        const pathHeaderEvent = path.join(__dirname, '../../', event.header_event)

        fs.unlink(pathHeaderEvent, (err) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: 'failed to delete event'
                });
            }
        })
        fs.unlink(pathGambarEvent, (err) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: 'failed to edit event'
                });
            }
        })

        const deletedEvent = await Event.deleteOne({ _id: id })
        if (deletedEvent.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'event not found'
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted event'
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const eventController = {
    createEvent,
    getEvent,
    getEventById,
    editEvent,
    deleteEvent,
}

export default eventController