import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTemporaryToken,
} from "../utils/generate-tokens.js";

const getAllPublishedCourses = asyncHandler(async (req, res) => {
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      price: true,
      isPublished: true,
      createdAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      instructors: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          modules: true,
          enrollments: true,
          quizzes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!courses || courses.length === 0)
    throw new ApiError(404, "No courses found");

  res.status(200).json(new ApiResponse(200, courses, "All courses fetched"));
});

const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await db.course.findUnique({
    where: { id, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      price: true,
      isPublished: true,
      createdAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      instructors: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      enrollments: {
        //Check if user is enrolled or not
        where: { userId: req.user.id },
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          modules: true,
          enrollments: true,
          quizzes: true,
        },
      },
    },
  });

  if (!course)
    throw new ApiError(404, "Published course not found or not available");

  res.status(200).json(new ApiResponse(200, course, "Course fetched"));
});

const getCourseProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userId = req.user.id;

  const enrollment = await db.enrollment.findFirst({
    where: {
      userId,
      courseId: id,
    },
    select: {
      id: true,
      enrolledAt: true,
    },
  });

  if (!enrollment)
    throw new ApiError(403, "You are not enrolled in this course");

  const courseData = await db.course.findUnique({
    where: id,
    select: {
      id: true,
      title: true,
      _count: {
        select: {
          modules: true,
        },
      },
      modules: {
        select: {
          id: true,
          title: true,
          order: true,
          _count: {
            select: {
              lessons: true,
            },
          },
          lessons: {
            select: {
              id: true,
              title: true,
              order: true,
              progress: {
                where: { id: userId },
                select: {
                  completed: true,
                  completedAt: true,
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!courseData) throw new ApiError(404, "Course not found");

  let totalLessons = 0;
  let completedLessons = 0;

  courseData.modules.forEach((module) => {
    totalLessons += module.lesson.length;

    module.length.forEach((lesson) => {
      if (lesson.progress.length > 0 && lesson.progress[0].completed) {
        completedLessons++;
      }
    });
  });

  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const progressData = {
    courseId: courseData.id,
    courseTitle: courseData.title,
    totalLessons,
    completedLessons,
    progressPercentage,
    totalModules: courseData._count.modules,
    moduleProgress: courseData.modules.map((module) => {
      const moduleTotal = module.lessons.length;
      const moduleCompleted = module.lessons.filter(
        (l) => l.progress.length > 0 && l.progress[0].completed,
      ).length;

      return {
        moduleId: module.id,
        moduleTitle: module.title,
        moduleOrder: module.order,
        totalLessons: moduleTotal,
        completedLessons: moduleCompleted,
        progressPercentage:
          moduleTotal > 0
            ? Math.round((moduleCompleted / moduleTotal) * 100)
            : 0,
      };
    }),
  };

  res
    .status(200)
    .json(new ApiResponse(200, progressData, "Course progress fetched"));
});

const checkUserEnrolled = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const enrollment = await db.enrollment.findFirst({
    where: {
      userId,
      courseId: id,
    },
    select: {
      id: true,
      enrolledAt: true,
      completed: true,
    },
  });

  if (!enrollment)
    throw new ApiError(403, "You are not enrolled in this course");

  res.status(200).json(new ApiResponse(200, enrollment, "Enrollment fetched"));
});

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
