import SQLi from "../handler/hacking/NoSQLInjection.js";

const handleHacking = () => {
    return function(req, res, next) {
        try {
            let isInjection = false;

            for (const key in req.body) {
                if (req.body.hasOwnProperty(key)) {
                    isInjection = SQLi(req.body[key]);
                    if (isInjection) {
                        break;
                    }
                }
            }

            if (isInjection) {
                res.status(400).json({
                    status: false,
                    "message": "NoSQL Injection Has Been Detected!"
                })
            } else {
                next();
            }
        } catch (error) {
            res.status(400).json({
                status: false,
                "message": "NoSQL Injection Has Been Detected!"
            })
        }
    }
}

export default handleHacking;