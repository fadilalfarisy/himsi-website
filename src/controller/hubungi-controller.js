import Hubungi from '../model/hubungi-kami.js'

const createHubungi = async (req, res, next) => {
    const {whatsapp,
        email} = req.body
    try {
        const newHubungi = await Hubungi.create({
            whatsapp,
            email,
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newHubungi
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

const getHubungi = async (req, res, next) => {
    try {
        const hubungi = await Hubungi.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: hubungi
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

const getHubungiById = async (req, res, next) => {
    const { id } = req.params
    try {
        const hubungi = await Hubungi.findOne({ _id: id })
        if (!hubungi) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'hubungi not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: hubungi
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

const editHubungi = async (req, res, next) => {
    const { id } = req.params
    const {whatsapp,
        email} = req.body
    try {
        const updatedHubungi = await Hubungi.updateOne({ _id: id }, {
            $set: {
                whatsapp,
                email
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: updatedHubungi
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

const deleteHubungi = async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedHubungi = await Hubungi.deleteOne({ _id: id })
        if (deletedHubungi.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'hubungi not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: deletedHubungi
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

const hubungiController = {
    createHubungi,
    getHubungi,
    getHubungiById,
    editHubungi,
    deleteHubungi,
}

export default hubungiController