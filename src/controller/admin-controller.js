import bcrypt from 'bcrypt'
import Admin from '../model/admin.js'
import { createAccessToken, createRefreshToken } from '../libs/jwt.js';

const register = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        //check duplicated email
        const admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'email is duplicate'
            });
        }
        //save new admin
        const newAdmin = await Admin.create({ email, password });

        const accessToken = createAccessToken(newAdmin._id);
        const refreshToken = createRefreshToken(newAdmin._id)

        //send cookie token
        res.cookie("refreshToken", refreshToken, {
            expires: new Date(Date.now() + 1000 * 30) //30s
        });

        res.status(201).json({
            status: 201,
            message: 'success',
            admin_id: newAdmin._id,
            email: newAdmin.email,
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
    const { email, password } = req.body;
    try {
        //check email is exist
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'email is invalid'
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

        const accessToken = createAccessToken(admin._id);
        const refreshToken = createRefreshToken(admin._id);

        //send cookie token
        res.cookie("refreshToken", refreshToken, {
            expires: new Date(Date.now() + 1000 * 30) //30s
        });

        res.status(200).json({
            status: 200,
            message: 'success',
            admin_id: admin._id,
            email: admin.email,
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

const listAdmin = async (req, res, next) => {
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

const adminController = {
    login,
    register,
    listAdmin
}

export default adminController