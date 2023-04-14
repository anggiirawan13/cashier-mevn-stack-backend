const ADMIN = "admin";
const CASHIER = "cashier";
const EMPLOYEE = "employee";

const ADMIN_ROLE = [ADMIN];
const CASHIER_ROLE = [CASHIER];
const EMPLOYEE_ROLE = [EMPLOYEE];
const ADMIN_CASHIER_ROLE = [ADMIN, CASHIER];
const ADMIN_EMPLOYEE_ROLE = [ADMIN, EMPLOYEE];
const CASHIER_EMPLOYEE_ROLE = [CASHIER, EMPLOYEE];
const ALL_ROLE = [ADMIN, CASHIER, EMPLOYEE];

const roleAuth = (req, res, next) => {
  try {
    if (String(req.path).includes("/auth/")) return next();

    let whoCanAccess = validateEndpointWithRole(req.method, req.path);
    if (!whoCanAccess.includes(req.jwt.role))
      throw { message: "UNAUTHORIZED_ROLE" };
    else return next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: err.message,
    });
  }
};

const validateEndpointWithRole = (reqMethod, reqEnpoint) => {
  let endpoint = String(reqEnpoint).toLowerCase();
  let method = String(reqMethod).toUpperCase();

  if (endpoint.includes("/users")) return ALL_ROLE;
  else if (endpoint.includes("/products")) {
    if (method === "GET") return ADMIN_CASHIER_ROLE;
    else return ADMIN_ROLE;
  } else if (endpoint.includes("/categories")) {
    if (method === "GET") return ADMIN_CASHIER_ROLE;
    else return ADMIN_ROLE;
  }

  return [];
};

export default roleAuth;
