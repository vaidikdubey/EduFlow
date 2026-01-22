import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getAllLessons = asyncHandler(async (req, res) => {});

const getLessonById = asyncHandler(async (req, res) => {});

const getLessonProgress = asyncHandler(async (req, res) => {});

const markLessonCompleted = asyncHandler(async (req, res) => {});

const createLesson = asyncHandler(async (req, res) => {});

const bulkCreateLessons = asyncHandler(async (req, res) => {});

const updateLesson = asyncHandler(async (req, res) => {});

const deleteLesson = asyncHandler(async (req, res) => {});

const reorderLessons = asyncHandler(async (req, res) => {});

export {
  getAllLessons,
  getLessonById,
  getLessonProgress,
  markLessonCompleted,
  createLesson,
  bulkCreateLessons,
  updateLesson,
  deleteLesson,
  reorderLessons,
};
