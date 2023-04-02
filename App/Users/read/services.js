import UserModels from '../models.js';

const index = async (req, res) => {
    try {
        let search = {
            status: 'active'
        }

        if (req.query.search) {
            search.fullname = { $regex: `^${req.query.search}`, $options: 'i' };
        }

        let options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
        }

        const resultUsers = await UserModels.paginate(search, options);

        if (!resultUsers) {
            throw {
                code: 404,
                message: 'USERS_NOT_FOUND',
            }
        }

        return res.status(200).json({
            status: true,
            total: resultUsers.length,
            users: resultUsers,
        })
    } catch (err) {
        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
}

const details = async (req, res) => {
    try {
        if (!req.params.id) {
            throw {
                code: 428,
                message: 'PARAMS_ID_IS_REQUIRED',
            }
        }

        const resultUser = await UserModels.findById(req.params.id);

        if (!resultUser) {
            throw {
                code: 404,
                message: 'USER_NOT_FOUND',
            }
        }

        return res.status(200).json({
            status: true,
            total: resultUser.length,
            user: resultUser
        })
    } catch (err) {
        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
}

export { index, details };