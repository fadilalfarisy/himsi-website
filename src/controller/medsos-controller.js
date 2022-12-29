import Medsos from '../model/media-sosial.js'

const createMedsos = async (req, res, next) => {
    const { instagram,
        facebook,
        twitter,
        discord,
        tiktok,
        youtube,
        linkedin } = req.body
    try {
        const newMedsos = await Medsos.create({
            instagram,
            facebook,
            twitter,
            discord,
            tiktok,
            youtube,
            linkedin
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newMedsos
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

const getMedsos = async (req, res, next) => {
    try {
        const medsos = await Medsos.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: medsos
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const getMedsosById = async (req, res, next) => {
    const { id } = req.params
    try {
        const medsos = await Medsos.findOne({ _id: id })
        if (!medsos) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'medsos not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: medsos
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const editMedsos = async (req, res, next) => {
    const { id } = req.params
    const { instagram,
        facebook,
        twitter,
        discord,
        tiktok,
        youtube,
        linkedin } = req.body
    try {
        const updatedMedsos = await Medsos.updateOne({ _id: id }, {
            $set: {
                instagram,
                facebook,
                twitter,
                discord,
                tiktok,
                youtube,
                linkedin 
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: updatedMedsos
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const deleteMedsos = async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedMedsos = await Medsos.deleteOne({ _id: id })
        if (deletedMedsos.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'Medsos not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: deletedMedsos
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const medsosController = {
    createMedsos,
    getMedsos,
    getMedsosById,
    editMedsos,
    deleteMedsos,
}

export default medsosController