import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const enrollInCourse = asyncHandler(async (req, res) => {});

const handleRazorpayWebhook = asyncHandler(async (req, res) => {});

const checkEnrollmentStatus = asyncHandler(async (req, res) => {});

const getMyEnrollments = asyncHandler(async (req, res) => {});

const markCourseCompleted = asyncHandler(async (req, res) => {});

const cancelEnrollment = asyncHandler(async (req, res) => {});

const getEnrollmentById = asyncHandler(async (req, res) => {});

const getCourseCertificate = asyncHandler(async (req, res) => {});

const getCourseEnrollments = asyncHandler(async (req, res) => {});

export {
  enrollInCourse,
  handleRazorpayWebhook,
  checkEnrollmentStatus,
  getMyEnrollments,
  markCourseCompleted,
  cancelEnrollment,
  getEnrollmentById,
  getCourseCertificate,
  getCourseEnrollments,
};
