import { decode } from 'jsonwebtoken';
import { verifyAccessToken } from '../libs/jwt.js';

const superAuth = (req, res, next) => {
    let accessToken = req.headers.authorization
    if (!accessToken) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'forbidden'
        });
    }

    try {
        accessToken = accessToken.split(' ')[1];
        verifyAccessToken(accessToken, (error, decoded) => {
            if (error || decoded.role !== 'super admin') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                });
            }
            console.log(decoded.role)
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
};

export default superAuth