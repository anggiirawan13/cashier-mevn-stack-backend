import user from "../apps/users/models.js";

const isEmailExist = async (email) => {
  return (await user.findOne({ email: String(email) })) ? true : false;
};

const isEmailExistWithUserID = async (id, email) => {
  return (await user.findOne({
    _id: { $ne: String(id) },
    email: String(email),
  }))
    ? true
    : false;
};

export { isEmailExist, isEmailExistWithUserID };
