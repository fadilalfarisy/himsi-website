import bcrypt from 'bcrypt'
import Admin from '../model/admin.js'
import { createAccessToken, createRefreshToken } from '../libs/jwt.js';

const register = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        //check duplicated username
        const admin = await Admin.findOne({ username });
        if (admin) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'username was used'
            });
        }
        //save new admin
        const newAdmin = await Admin.create({
            username,
            password
        });

        let role = 'super admin'
        const accessToken = createAccessToken({
            id: newAdmin._id,
            role: role
        });
        const refreshToken = createRefreshToken(newAdmin._id)

        //send cookie token
        res.cookie("refreshToken", refreshToken, {
            expires: new Date(Date.now() + 1000 * 60 * 15), //15m
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(201).json({
            status: 201,
            message: 'success',
            username: newAdmin.username,
            role: role,
            accessToken: accessToken
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        //check username is exist
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'username is invalid'
            });
        }

        //compare the password
        const hashPassword = await bcrypt.compare(password.toString(), admin.password)
        if (!hashPassword) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'password is invalid'
            });
        }

        const accessToken = createAccessToken({
            id: admin._id,
            role: admin.role
        });
        const refreshToken = createRefreshToken(admin._id);

        //send cookie token
        res.cookie("refreshToken", refreshToken, {
            expires: new Date(Date.now() + 1000 * 60 * 15), //15m
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(200).json({
            status: 200,
            message: 'success',
            username: admin.username,
            role: admin.role,
            accessToken: accessToken
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
};

const createAdmin = async (req, res, next) => {
    const {
        username,
        password,
        nama_admin,
        role
    } = req.body
    try {
        const newAdmin = await Admin.create({
            username,
            password,
            nama_admin,
            role
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newAdmin
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

const getAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: admin
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

const getAdminById = async (req, res, next) => {
    const { id } = req.params
    try {
        const admin = await Admin.findOne({ _id: id })
        if (!admin) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'admin not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: admin
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

const editAdmin = async (req, res, next) => {
    const { id } = req.params
    const {
        username,
        password,
        nama_admin,
        role
    } = req.body
    try {
        const updatedAdmin = await Admin.updateOne({ _id: id }, {
            $set: {
                username,
                password,
                nama_admin,
                role
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited admin'
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

const deleteAdmin = async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedAdmin = await Admin.deleteOne({ _id: id })
        if (deletedAdmin.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'admin not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted admin'
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

const adminController = {
    login,
    register,
    getAdmin,
    getAdminById,
    createAdmin,
    editAdmin,
    deleteAdmin
}

export default adminController