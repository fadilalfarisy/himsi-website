import fs from 'fs';
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
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
        id_divisi
    } = req.body

    if (!tanggal_selesai_event) {
        tanggal_selesai_event = null
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

        let pathDokumentasiEvent = []

        if (req.files.dokumentasi_event) {
            function uploadGambarDokumentasi(pathDokumentasi) {
                return new Promise((resolve) => {
                    cloudinary.uploader.upload(pathDokumentasi).then(result => {
                        resolve(result)
                    })
                })
            }

            async function pushData(pathGambar) {
                const tempPath = []
                for (const element of pathGambar) {
                    const uploadDokumentasi = await uploadGambarDokumentasi(element.path)
                    tempPath.push({
                        public_id: uploadDokumentasi.public_id,
                        url: uploadDokumentasi.secure_url
                    })
                }
                return tempPath
            }

            const { dokumentasi_event } = req.files
            pathDokumentasiEvent = await pushData(dokumentasi_event)
        }

        const uploadHeaderEvent = await cloudinary.uploader.upload(pathHeaderEvent)
        const uploadGambarEvent = await cloudinary.uploader.upload(pathGambarEvent)

        const newEvent = await Event.create({
            judul_event,
            tanggal_mulai_event,
            tanggal_selesai_event,
            status_event,
            kategori_event,
            isi_event,
            penulis_event,
            header_event: {
                public_id: uploadHeaderEvent.public_id,
                url: uploadHeaderEvent.secure_url
            },
            gambar_event: {
                public_id: uploadGambarEvent.public_id,
                url: uploadGambarEvent.secure_url
            },
            dokumentasi_event: pathDokumentasiEvent,
            id_divisi
        });

        res.status(200).json({
            status: 200,
            message: 'success',
            data: newEvent
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
        let { search, bidang, kategori } = req.query;
        let query = {}

        if (bidang) {
            query = {
                ...query,
                'divisi.nama_divisi': {
                    $regex: bidang,
                    $options: "i"
                }
            }
        }

        if (kategori) {
            query = {
                ...query,
                'kategori_event': {
                    $regex: kategori,
                    $options: "i"
                }
            }
        }

        if (search) {
            query = {
                ...query,
                $or: [{
                    'judul_event': {
                        $regex: search,
                        $options: "i"
                    },
                }, {
                    'isi_event': {
                        $regex: search,
                        $options: "i"
                    },
                }]
            }
        }

        let event = await Event.aggregate([
            {
                $lookup: {
                    from: 'divisis',
                    localField: 'id_divisi',
                    foreignField: '_id',
                    as: 'divisi'
                },
            }, {
                $unwind: '$divisi'
            }, {
                $lookup: {
                    from: 'bidangs',
                    localField: 'divisi.id_bidang',
                    foreignField: '_id',
                    as: 'bidang'
                },
            }, {
                $unwind: '$bidang'
            }, {
                $match: query
            }, {
                $project: {
                    _id: 1,
                    judul_event: 1,
                    tanggal_mulai_event: 1,
                    tanggal_selesai_event: 1,
                    status_event: 1,
                    kategori_event: 1,
                    isi_event: 1,
                    penulis_event: 1,
                    header_event: 1,
                    gambar_event: 1,
                    dokumentasi_event: 1,
                    divisi: '$divisi.nama_divisi',
                    bidang: '$bidang.nama_bidang'
                }
            }
        ])
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
        tanggal_mulai_event,
        tanggal_selesai_event,
        status_event,
        kategori_event,
        isi_event,
        penulis_event,
        id_divisi
    } = req.body

    let header_event, public_id_header_event, gambar_event, public_id_gambar_event = ''
    let dokumentasi_event = []

    if (!tanggal_selesai_event) {
        tanggal_selesai_event = null
    }
    try {
        const existingEvent = await Event.findOne({ _id: id })
        if (!existingEvent) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'event not found'
            });
        }

        if (!req.files.header_event) {
            public_id_header_event = existingEvent.header_event.public_id
            header_event = existingEvent.header_event.url
            console.log('update without new header')
        }
        if (!req.files.gambar_event) {
            public_id_gambar_event = existingEvent.gambar_event.public_id
            gambar_event = existingEvent.gambar_event.url
            console.log('update without new gambar')
        }
        if (!req.files.dokumentasi_event) {
            dokumentasi_event = existingEvent.dokumentasi_event
            console.log('update without new dokumentasi')
        }

        if (req.files.header_event) {
            const {
                header_event: [{
                    path: pathHeaderEvent
                }],
            } = req.files
            //delete old images
            cloudinary.uploader.destroy(existingEvent.header_event.public_id)
                .then(result => console.log(result))
            //save new images
            const uploadHeaderEvent = await cloudinary.uploader.upload(pathHeaderEvent)

            public_id_header_event = uploadHeaderEvent.public_id
            header_event = uploadHeaderEvent.secure_url
            console.log('update with new header')
        }

        if (req.files.gambar_event) {
            const {
                gambar_event: [{
                    path: pathGambarEvent
                }],
            } = req.files
            //delete old images
            cloudinary.uploader.destroy(existingEvent.gambar_event.public_id)
                .then(result => console.log(result))
            //save new images
            const uploadGambarEvent = await cloudinary.uploader.upload(pathGambarEvent)

            public_id_gambar_event = uploadGambarEvent.public_id
            gambar_event = uploadGambarEvent.secure_url
            console.log('update with new gambar')
        }

        if (req.files.dokumentasi_event) {
            //delete old images
            const oldDokumentasiEvent = existingEvent.dokumentasi_event
            if (oldDokumentasiEvent.length > 0) {
                for (const element of oldDokumentasiEvent) {
                    cloudinary.uploader.destroy(element.public_id)
                        .then(result => console.log(result))
                }
            }

            //save new images
            function uploadGambarDokumentasi(pathDokumentasi) {
                return new Promise((resolve) => {
                    cloudinary.uploader.upload(pathDokumentasi).then(result => {
                        resolve(result)
                    })
                })
            }

            async function pushData(pathGambar) {
                const tempPath = []
                for (const element of pathGambar) {
                    const uploadDokumentasi = await uploadGambarDokumentasi(element.path)
                    tempPath.push({
                        public_id: uploadDokumentasi.public_id,
                        url: uploadDokumentasi.secure_url
                    })
                }
                return tempPath
            }

            const pathDokumentasiEvent = req.files.dokumentasi_event
            dokumentasi_event = await pushData(pathDokumentasiEvent)
            console.log('update with new dokumentasi')
        }

        // const oldpathGambarEvent = path.join(__dirname, '../../', existingEvent.gambar_event)
        // const oldpathHeaderEvent = path.join(__dirname, '../../', existingEvent.header_event)

        // fs.unlink(oldpathGambarEvent, (err) => {
        //     if (err) {
        //         return res.status(400).json({
        //             status: 400,
        //             message: 'failed',
        //             info: 'failed to edit event'
        //         });
        //     }
        // })
        // fs.unlink(oldpathHeaderEvent, (err) => {
        //     if (err) {
        //         return res.status(400).json({
        //             status: 400,
        //             message: 'failed',
        //             info: 'failed to edit event'
        //         });
        //     }
        // })

        await Event.updateOne({ _id: id }, {
            $set: {
                judul_event,
                tanggal_mulai_event,
                tanggal_selesai_event,
                status_event,
                kategori_event,
                isi_event,
                penulis_event,
                header_event: {
                    public_id: public_id_header_event,
                    url: header_event
                },
                gambar_event: {
                    public_id: public_id_gambar_event,
                    url: gambar_event
                },
                dokumentasi_event: dokumentasi_event,
                id_divisi
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
        const existingEvent = await Event.findOne({ _id: id })
        if (!existingEvent) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'event not found'
            });
        }

        cloudinary.uploader.destroy(existingEvent.header_event.public_id)
            .then(result => console.log(result))
        cloudinary.uploader.destroy(existingEvent.gambar_event.public_id)
            .then(result => console.log(result))
        if (existingEvent.dokumentasi_event.length > 0) {
            const { dokumentasi_event } = existingEvent
            for (const element of dokumentasi_event) {
                cloudinary.uploader.destroy(element.public_id).then(result => console.log(result))
            }
        }

        // const pathGambarEvent = path.join(__dirname, '../../', event.gambar_event)
        // const pathHeaderEvent = path.join(__dirname, '../../', event.header_event)

        // fs.unlink(pathHeaderEvent, (err) => console.log(err))
        // fs.unlink(pathGambarEvent, (err) => console.log(err))

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