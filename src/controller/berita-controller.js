import fs from 'fs';
import path from 'path'
import {
    fileURLToPath
} from 'url'
const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)
import Berita from "../model/berita.js"
import cloudinary from '../libs/cloudinary.js';

const createBerita = async (req, res, next) => {
    const {
        judul_berita,
        tanggal_berita,
        kategori_berita,
        isi_berita,
        penulis_berita,
        link_pdf,
        link_berita
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
            header_berita: [{
                path: pathHeaderBerita
            }],
            gambar_berita: [{
                path: pathGambarBerita
            }],
        } = req.files

        const uploadHeaderBerita = await cloudinary.uploader.upload(pathHeaderBerita)
        const uploadGambarBerita = await cloudinary.uploader.upload(pathGambarBerita)

        const newBerita = await Berita.create({
            judul_berita,
            tanggal_berita,
            kategori_berita,
            isi_berita,
            penulis_berita,
            link_pdf,
            link_berita,
            header_berita: {
                public_id: uploadHeaderBerita.public_id,
                url: uploadHeaderBerita.secure_url
            },
            gambar_berita: {
                public_id: uploadGambarBerita.public_id,
                url: uploadGambarBerita.secure_url
            },
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
        let { search, kategori, judul, skip, limit, page } = req.query;
        let query = {}

        //pagination
        let querySkip = 0
        let queryLimit = 8
        let queryPage = 1
        if (skip) {
            querySkip = Number(skip)
        }
        if (limit) {
            queryLimit = Number(limit)
        }
        if (page) {
            queryPage = Number(page)
        }

        if (kategori) {
            query = {
                ...query,
                'kategori_berita': {
                    $in: [kategori]
                }
            }
        }

        if (judul) {
            query = {
                ...query,
                'judul_berita': {
                    $regex: judul,
                    $options: "i"
                }
            }
        }

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

        let berita = await Berita.aggregate([
            {
                $match: query
            }, {
                $facet: {
                    pagination: [{
                        $count: "total"
                    }, {
                        $addFields: { page: queryPage }
                    }],
                    berita: [{
                        $skip: (queryPage - 1) * querySkip
                    }, {
                        $limit: queryLimit
                    }],
                },
            }, {
                $unwind: '$pagination'
            }, {
                $project: {
                    total: '$pagination.total',
                    page: '$pagination.page',
                    berita: '$berita'
                }
            }
        ])

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
    const {
        id
    } = req.params
    try {
        const berita = await Berita.findOne({
            _id: id
        })
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
    const {
        id
    } = req.params
    const {
        judul_berita,
        tanggal_berita,
        kategori_berita,
        isi_berita,
        penulis_berita,
        link_pdf,
        link_berita,
    } = req.body

    let header_berita, public_id_header_berita, gambar_berita, public_id_gambar_berita = ''

    try {

        const existingBerita = await Berita.findOne({
            _id: id
        })
        if (!existingBerita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }

        //when gambar_berita and header_berita not updated
        if (!req.files.gambar_berita && !req.files.header_berita) {
            header_berita = existingBerita.header_berita.url
            public_id_header_berita = existingBerita.header_berita.public_id
            gambar_berita = existingBerita.gambar_berita.url
            public_id_gambar_berita = existingBerita.gambar_berita.public_id

            //when header berita only is updated
        } else if (req.files.header_berita && !req.files.gambar_berita) {
            const {
                header_berita: [{
                    path: pathHeaderBerita
                }],
            } = req.files

            //delete old images
            cloudinary.uploader.destroy(existingBerita.header_berita.public_id)
                .then(result => console.log(result))
            //save new images
            const uploadHeaderBerita = await cloudinary.uploader.upload(pathHeaderBerita)

            header_berita = uploadHeaderBerita.secure_url
            public_id_header_berita = uploadHeaderBerita.public_id
            gambar_berita = existingBerita.gambar_berita.url
            public_id_gambar_berita = existingBerita.gambar_berita.public_id

            //when gambar_berita only is updated
        } else if (req.files.gambar_berita && !req.files.header_berita) {
            const {
                gambar_berita: [{
                    path: pathGambarBerita
                }],
            } = req.files

            //delete old images
            cloudinary.uploader.destroy(existingBerita.gambar_berita.public_id)
                .then(result => console.log(result))
            //save new images
            const uploadGambarBerita = await cloudinary.uploader.upload(pathGambarBerita)

            header_berita = existingBerita.header_berita.url
            public_id_header_berita = existingBerita.header_berita.public_id
            gambar_berita = uploadGambarBerita.secret_url
            public_id_gambar_berita = uploadGambarBerita.public_id

            //when gambar_berita and header is updated
        } else if (req.files.header_berita && req.files.gambar_berita) {
            const {
                header_berita: [{
                    path: pathHeaderBerita
                }],
                gambar_berita: [{
                    path: pathGambarBerita
                }],
            } = req.files

            //delete old images
            cloudinary.uploader.destroy(existingBerita.header_berita.public_id)
                .then(result => console.log(result))
            cloudinary.uploader.destroy(existingBerita.gambar_berita.public_id)
                .then(result => console.log(result))
            //save new images
            const uploadHeaderBerita = await cloudinary.uploader.upload(pathHeaderBerita)
            const uploadGambarBerita = await cloudinary.uploader.upload(pathGambarBerita)

            header_berita = uploadHeaderBerita.secure_url
            public_id_header_berita = uploadHeaderBerita.public_id
            gambar_berita = uploadGambarBerita.secure_url
            public_id_gambar_berita = uploadGambarBerita.public_id
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

        await Berita.updateOne({
            _id: id
        }, {
            $set: {
                judul_berita,
                tanggal_berita,
                kategori_berita,
                isi_berita,
                penulis_berita,
                link_pdf,
                link_berita,
                header_berita: {
                    public_id: public_id_header_berita,
                    url: header_berita
                },
                gambar_berita: {
                    public_id: public_id_gambar_berita,
                    url: gambar_berita
                },
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
    const {
        id
    } = req.params
    try {
        const berita = await Berita.findOne({
            _id: id
        })
        if (!berita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }

        //delete image
        cloudinary.uploader.destroy(berita.header_berita.public_id)
            .then(result => console.log(result))
        cloudinary.uploader.destroy(berita.gambar_berita.public_id)
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

        const deletedBerita = await Berita.deleteOne({
            _id: id
        })
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
        console.log(error.message)
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