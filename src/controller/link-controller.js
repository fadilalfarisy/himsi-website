import Link from "../model/link.js";

const getLink = async (req, res, next) => {
    try {
        let match = {};
        // filter by kategori
        if (req.query.kategori) {
            match.kategori = req.query.kategori;
        }
        let response = await Link.aggregate([{
            $match: match
        },])
        res.status(200).json({
            status: 200,
            message: "success",
            data: response,
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "There's an error when retrieving links",
        });
    }
};

const getLinkById = async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        const link = await Link.findOne({
            _id: id
        });
        if (!link) {
            return res.status(400).json({
                status: 400,
                message: "failed",
                info: "link not found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "success",
            data: link,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "There's an error when retrieving links with that id",
        });
    }
};

const createLink = async (req, res, next) => {
    const {
        nama_link,
        url,
        kategori
    } = req.body;
    try {
        const newLink = await Link.create({
            nama_link,
            url,
            kategori,
        });
        res.status(200).json({
            status: 200,
            message: "success",
            data: newLink,
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

const editLink = async (req, res, next) => {
    const {
        id
    } = req.params;
    const {
        nama_link,
        url,
        kategori
    } = req.body;
    try {
        const updatedLink = await Link.updateOne({
            _id: id
        }, {
            $set: {
                nama_link,
                url,
                kategori,
            },
        });
        res.status(200).json({
            status: 200,
            message: "success",
            data: 'successfully edited link',
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

const deleteLink = async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        const deletedLink = await Link.deleteOne({
            _id: id
        });
        if (deletedLink.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: "failed",
                info: "link not found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "success",
            data: 'successfully deleted link'
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

const linkController = {
    createLink,
    getLink,
    getLinkById,
    editLink,
    deleteLink,
};

export default linkController;