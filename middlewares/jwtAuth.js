import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

const env = dotenv.config().parsed;

const jwtAuth = () =>  {
    return function (req, res, next) {
        try {
            if (!req.headers.authorization) {
                throw {
                    message: 'TOKEN_IS_REQUIRED',
                }
            } else {
                const token = req.headers.authorization.split(' ')[1]
                const verify = jsonwebtoken.verify(token, env.JWT_ACCESS_TOKEN_SECRET)
                req.jwt = verify
                next()
            }
        } catch (err) {
            if (err.message === 'jwt expired') {
                err.message = 'ACCESS_TOKEN_EXPIRED'
            } else if (err.message === 'TOKEN_IS_REQUIRED') {
                err.message = 'TOKEN_IS_REQUIRED'
            } else {
                err.message = 'TOKEN_INVALID'
            }

            return res.status(401).json({
                status: false,
                message: err.message
            })
        }
    }
}

export default jwtAuth