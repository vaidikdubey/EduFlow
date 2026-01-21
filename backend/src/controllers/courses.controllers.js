import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTemporaryToken,
} from "../utils/generate-tokens.js";

const getAllPublishedCourses = asyncHandler(async (req, res) => {});

const getCourseById = asyncHandler(async (req, res) => {});

const getCourseProgress = asyncHandler(async (req, res) => {});

const checkUserEnrolled = asyncHandler(async (req, res) => {});

// Admin controllers
const getAllCourses = asyncHandler(async (req, res) => {});

const createCourse = asyncHandler(async (req, res) => {});

const updateCourse = asyncHandler(async (req, res) => {});

const deleteCourse = asyncHandler(async (req, res) => {});

const publishCourse = asyncHandler(async (req, res) => {});

const getAllCourseEnrollments = asyncHandler(async (req, res) => {});

export {
  getAllPublishedCourses,
  getCourseById,
  getCourseProgress,
  checkUserEnrolled,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  getAllCourseEnrollments,
};
