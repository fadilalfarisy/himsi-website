import Divisi from '../model/divisi-bidang.js'

const createDivisi = async (req, res, next) => {
    const { bidang,
        singkatan,
        deskripsi,
        divisi } = req.body
    try {
        const newDivisi = await Divisi.create({
            bidang,
            singkatan,
            deskripsi,
            divisi
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newDivisi
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

const getDivisi = async (req, res, next) => {
    try {
        const divisi = await Divisi.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: divisi
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

const getDivisiById = async (req, res, next) => {
    const { id } = req.params
    try {
        const divisi = await Divisi.findOne({ _id: id })
        if (!divisi) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'divisi not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: divisi
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

const editDivisi = async (req, res, next) => {
    const { id } = req.params
    const { bidang,
        singkatan,
        deskripsi,
        divisi } = req.body
    try {
        const updatedDivisi = await Divisi.updateOne({ _id: id }, {
            $set: {
                bidang,
                singkatan,
                deskripsi,
                divisi
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: updatedDivisi
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

const deleteDivisi = async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedDivisi = await Divisi.deleteOne({ _id: id })
        if (deletedDivisi.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'divisi not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: deletedDivisi
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

const profileController = {
    createDivisi,
    getDivisi,
    getDivisiById,
    editDivisi,
    deleteDivisi,
}

export default profileController