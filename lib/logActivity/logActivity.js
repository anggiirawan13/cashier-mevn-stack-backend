import LogActivityModels from "./models.js";

const store = (userId, menuName, activityName) => {
  const dateNow = new Date().getTime();
  const newActivity = new LogActivityModels({
    user_id: userId,
    menu_name: menuName,
    activity_name: activityName,
    created_at: dateNow,
    updated_at: dateNow,
  });

  newActivity.save();
};

export default store;
