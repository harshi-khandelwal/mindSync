// controllers/user.controller.js

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// ======================== REGISTER ========================
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password, role } = req.body;

    if (!fullName || !username || !email || !password) {
        if (req.file) fs.unlinkSync(req.file.path);
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        throw new ApiError(409, "User with this email or username already exists");
    }

    let avatarUrl = "";
    if (req.file?.path && req.file.size > 0) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) throw new ApiError(500, "Cloudinary upload failed");
        avatarUrl = uploadResult.secure_url;
    }

    const user = await User.create({
        fullName,
        username,
        email,
        password,
        avatar: avatarUrl,
        role
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json(
        new ApiResponse(201, {
            user: user.getPublicProfile(),
            token,
        }, "User registered successfully")
    );
});

// ======================== LOGIN ========================
const loginUser = asyncHandler(async (req, res) => {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
        throw new ApiError(400, "Email/Username and Password are required");
    }

    const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
        new ApiResponse(200, {
            user: user.getPublicProfile(),
            token,
        }, "Login successful")
    );
});

// ======================== GET PROFILE ========================
const getUserProfile = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
});

// ======================== UPDATE PROFILE ========================
const updateUser = asyncHandler(async (req, res) => {
    const updates = req.body;

    // Handle image upload if present
    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) throw new ApiError(500, "Image upload failed");
        updates.avatar = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
    }).select("-password");

    if (!updatedUser) {
        throw new ApiError(404, "User not found or update failed");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// ======================== DELETE USER ========================
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found or already deleted");
    }

    res.clearCookie("token");

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User deleted successfully"));
});

// ======================== LOGOUT ========================
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token");

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});


export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUser,
    deleteUser,
};
