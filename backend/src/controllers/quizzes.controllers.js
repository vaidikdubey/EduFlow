import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getQuizzesByModule = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user.id;

  const moduleInfo = await db.module.findUnique({
    where: { id: moduleId },
    select: {
      id: true,
      title: true,
      courseId: true,
      course: {
        select: {
          id: true,
          title: true,
          createdById: true,
          isPublished: true,
        },
      },
    },
  });

  if (!moduleInfo) throw new ApiError(404, "Module not found");

  const isInstructor = moduleInfo.course.createdById === userId;
  let isEnrolled = false;

  if (userId) {
    const enrollment = await db.enrollment.findFirst({
      where: {
        userId,
        courseId: moduleInfo.courseId,
      },
      select: { id: true },
    });

    isEnrolled = !!enrollment;
  }

  if (!isEnrolled && !isInstructor)
    throw new ApiError(
      403,
      "You need to enroll in this course to view module quizzes",
    );

  const quizzes = await db.quiz.findMany({
    where: { moduleId },
    select: {
      id: true,
      title: true,
      courseId: true,
      moduleId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          attempts: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        module: {
          id: moduleInfo.id,
          title: moduleInfo.title,
          courseId: moduleInfo.courseId,
          courseTitle: moduleInfo.course.title,
        },
        quizzes,
        totalQuizzes: quizzes.length,
      },
      quizzes.length
        ? "Quizzes fetched successfully"
        : "No quizzes available in this module yet",
    ),
  );
});

const getQuizzesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const courseInfo = await db.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdById: true,
      type: true,
      price: true,
      isPublished: true,
    },
  });

  if (!courseInfo || !courseInfo.isPublished) throw new ApiError(404, "Course not found");

  const isInstructor = courseInfo.createdById === userId;
  let isEnrolled;

  if (userId) {
    const enrollData = await db.enrollment.findFirst({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      select: {
        id: true,
      },
    });

    isEnrolled = !!enrollData;
  }

  if (!isInstructor && !isEnrolled)
    throw new ApiError(
      403,
      "You need to enroll in this course to view quizzes",
    );

  const quizzes = await db.quiz.findMany({
    where: { courseId },
    select: {
      id: true,
      title: true,
      courseId: true,
      moduleId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          attempts: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        course: {
          id: courseInfo.id,
          title: courseInfo.title,
          description: courseInfo.description,
          type: courseInfo.type,
          price: courseInfo.price,
          isPublished: courseInfo.isPublished,
        },
        quizzes,
        totalQuizzes: quizzes.length,
      },
      quizzes.length
        ? "Quizzes fetched successfully"
        : "No quizzes available in this course yet",
    ),
  );
});

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
