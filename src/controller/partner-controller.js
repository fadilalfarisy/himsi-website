import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Partner from "../model/partner.js";

const getPartner = async (req, res, next) => {
  try {
    const partner = await Partner.find();
    res.status(200).json({
      status: 200,
      message: "success",
      data: partner,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: "failed",
      info: "server error",
    });
  }
};

const getPartnerById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const partner = await Partner.findOne({ _id: id });
    if (!partner) {
      return res.status(400).json({
        status: 400,
        message: "failed",
        info: "partner not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "success",
      data: partner,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: "failed",
      info: "server error",
    });
  }
};

const createPartner = async (req, res, next) => {
  const { name } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "failed",
        info: "please upload partner logo image",
      });
    }
    const pathPartner = req.file.path;

    const newPartner = await Partner.create({
      name,
      logo: pathPartner
    });
    res.status(200).json({
      status: 200,
      message: "success",
      data: newPartner,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: "failed",
      info: "server error",
    });
  }
};

const editPartner = async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload logo image for partner'
            });
        }

        const existingPartner = await Partner.findOne({ _id: id })
        if (!existingPartner) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'partner data not found'
            });
        }
        const imagePath = path.join(__dirname, '../../', existingPartner.logo)
        fs.unlink(imagePath, (err) => { console.log(err) })

        const pathPartner = req.file.path
        const updatedPartner = await Partner.updateOne({ _id: id }, {
            $set: {
                name,
                logo: pathPartner
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: updatedPartner
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

const deletePartner = async (req, res, next) => {
    const { id } = req.params
    try {
        const partner = await Partner.findOne({ _id: id })
        if (!partner) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'partner data not found'
            });
        }
        const imagePath = path.join(__dirname, '../../', partner.logo)
        fs.unlink(imagePath, (err) => { console.log(err) })

        const deletedPartner = await Partner.deleteOne({ _id: id })
        if (deletedPartner.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'partner data not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: deletedPartner
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const partnerController = {
    createPartner,
    getPartner,
    getPartnerById,
    editPartner,
    deletePartner,
}

export default partnerController


