import bcrypt from "bcryptjs"
import { db } from "../db/db.js";
import { UserRole } from "../generated/prisma/index.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { generateAccessToken, generateRefreshToken, generateTemporaryToken } from "../utils/generate-tokens.js";
import { } from "../utils/mail.js";


const registerUser = asyncHandler(async (req, res, next) => {
        
})

const loginUser = asyncHandler(async (req, res, next) => {
    
})

const verifyUser = asyncHandler(async (req, res, next) => {
    
})

const getProfile = asyncHandler(async (req, res, next) => {
    
})

const logoutUser = asyncHandler(async (req, res, next) => {
    
})

const forgotPassword = asyncHandler(async (req, res, next) => {
    
})

const resetPassword = asyncHandler(async (req, res, next) => {
    
})

const changePassword = asyncHandler(async (req, res, next) => {
    
})

const resendVerificationEmail = asyncHandler(async (req, res, next) => {

})

const updateProfile = asyncHandler(async (req, res, next) => {
    
})

const deleteProfile = asyncHandler(async (req, res, next) => {
    
})

export {
    registerUser,
    loginUser,
    verifyUser,
    getProfile,
    logoutUser,
    forgotPassword,
    resetPassword,
    changePassword,
    resendVerificationEmail,
    updateProfile,
    deleteProfile
}