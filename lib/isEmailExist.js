import user from '../App/Users/models.js';

const isEmailExist = async (email) => {
    const User = await user.findOne({ email: String(email) });

    if (!User) {
        return false;
    }

    return true;
};

const isEmailExistWithUserID = async (id, email) => {
    const User = await user.findOne({ _id: { $ne: String(id) }, email: String(email) });

    if (!User) {
        return false;
    }

    return true;
};

export { isEmailExist, isEmailExistWithUserID };