import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import Himpunan from "../model/himpunan.js"

const createVisi = async (req, res, next) => {
    const {
        visi,
        misi } = req.body
    try {
        await Himpunan.updateMany({}, {
            $set: {
                visi: visi,
                misi: misi,
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                visi,
                misi
            }
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

const getVisi = async (req, res, next) => {
    try {
        const visi = await Himpunan.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: visi
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

const getVisiById = async (req, res, next) => {
    const { id } = req.params
    try {
        const visi = await Himpunan.findOne({ _id: id })
        if (!visi) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'visi not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: visi
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

const editVisi = async (req, res, next) => {
    const {
        visi,
        misi } = req.body
    try {

        await Himpunan.updateMany({}, {
            $set: {
                visi,
                misi,
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited visi misi'
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

const deleteVisi = async (req, res, next) => {
    try {

        await Himpunan.updateMany({}, {
            $set: {
                visi: '',
                misi: [],
            }
        })

        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted visi misi'
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const visiController = {
    createVisi,
    getVisi,
    getVisiById,
    editVisi,
    deleteVisi,
}

export default visiController