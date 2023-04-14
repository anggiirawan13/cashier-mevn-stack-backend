import SQLi from "../handler/hacking/NoSQLInjection.js";

const handleHacking = (req, res, next) => {
  try {
    let isInjection = false;

    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        isInjection = SQLi(req.body[key]);

        if (isInjection) break;
      }
    }

    if (isInjection) {
      return res.status(400).json({
        status: false,
        message: "NoSQL Injection Has Been Detected!",
      });
    } else return next();
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "NoSQL Injection Has Been Detected!",
    });
  }
};

export default handleHacking;
