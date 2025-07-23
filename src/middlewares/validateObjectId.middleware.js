// middlewares/validateObjectId.middleware.js
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const validateObjectId = (param = "id") => {
    return (req, res, next) => {
        const id = req.params[param];
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, `Invalid ObjectId: ${param}`);
        }
        next();
    };
};

export { validateObjectId };
