const roleAuth = (whoCanAccess) =>  {
    return function (req, res, next) {
        try {
            if (!whoCanAccess.includes(req.jwt.role)) {
                throw {
                    message: 'UNAUTHORIZED_ROLE',
                }
            } else {
                next()
            }
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message
            })
        }
    }
}

export default roleAuth