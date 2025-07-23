// middlewares/authorize.middleware.js
import { ApiError } from "../utils/ApiError.js";

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Forbidden: Insufficient permissions");
        }
        next();
    };
};

export { authorizeRoles };
