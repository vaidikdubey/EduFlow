import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getQuizzesByModule = asyncHandler(async (req, res) => {});

const getQuizzesByCourse = asyncHandler(async (req, res) => {});

const getQuizById = asyncHandler(async (req, res) => {});

const submitQuizAttempt = asyncHandler(async (req, res) => {});

const getMyQuizAttempts = asyncHandler(async (req, res) => {});

const createQuiz = asyncHandler(async (req, res) => {});

const updateQuiz = asyncHandler(async (req, res) => {});

const deleteQuiz = asyncHandler(async (req, res) => {});

const getAllQuizAttempts = asyncHandler(async (req, res) => {});

export {
  getQuizzesByModule,
  getQuizzesByCourse,
  getQuizById,
  submitQuizAttempt,
  getMyQuizAttempts,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getAllQuizAttempts,
};
