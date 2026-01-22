import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getAllLessons = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user.id;

  if (!moduleId) throw new ApiError(400, "Module ID is required");

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
          isPublished: true,
          createdById: true,
        },
      },
    },
  });

  if (!moduleInfo) throw new ApiError(404, "Module not found");

  let isEnrolled = false;
  let isInstructor = false;

  if (userId) {
    isInstructor = moduleInfo.course.createdById === userId;

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
    throw new ApiError(400, "You need to enroll in the course to view lessons");

  const allLessons = await db.lesson.findMany({
    where: { moduleId },
    select: {
      id: true,
      title: true,
      contentType: true,
      contentUrl: true,
      order: true,
      moduleId: true,
      createdAt: true,
      progress: userId
        ? {
            where: { userId },
            select: { completed: true, completedAt: true },
          }
        : undefined,
    },
    orderBy: { order: "asc" },
  });

  const enhancedLessons = allLessons.map((lesson) => ({
    ...lesson,
    isCompleted: lesson.progress.length > 0 && lesson.progress[0].completed,
    progress: undefined,
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        module: {
          id: moduleInfo.id,
          title: moduleInfo.title,
          courseTitle: moduleInfo.course.title,
          courseId: moduleInfo.courseId,
        },
        lessons: enhancedLessons,
        totalLessons: allLessons.length,
        enrolled: isEnrolled,
        instructorView: isInstructor,
      },
      allLessons?.length
        ? "All lessons fetched"
        : "No lessons found in this module yet",
    ),
  );
});

const getLessonById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) throw new ApiError(400, "Lesson ID is required");

  const lessonInfo = await db.lesson.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      contentType: true,
      contentUrl: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      progress: userId
        ? {
            select: {
              completed: true,
              completedAt: true,
            },
          }
        : undefined,
      module: {
        select: {
          id: true,
          title: true,
          order: true,
          course: {
            select: {
              id: true,
              title: true,
              isPublished: true,
              createdById: true,
            },
          },
        },
      },
    },
  });

  if (!lessonInfo) throw new ApiError(404, "Lesson not found");

  const isInstructor = lessonInfo.module.course.createdById === userId;
  const isEnrolled = userId
    ? await db.enrollment.findFirst({
        where: { userId, courseId: lessonInfo.module.course.id },
        select: { id: true },
      })
    : null;

  if (!isEnrolled && !isInstructor)
    throw new ApiError(
      400,
      "You need to enroll in the course to view this lesson",
    );

  const isCompleted =
    lessonInfo.progress?.length > 0 && lessonInfo.progress[0].completed;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        lesson: {
          id: lessonInfo.id,
          title: lessonInfo.title,
          contentType: lessonInfo.contentType,
          contentUrl: userId ? lessonInfo.contentUrl : undefined,
          order: lessonInfo.order,
          createdAt: lessonInfo.createdAt,
          updatedAt: lessonInfo.updatedAt,
          isCompleted,
          progress: lessonInfo.progress?.[0] || null,
        },
        module: {
          id: lessonInfo.module.id,
          title: lessonInfo.module.title,
          order: lessonInfo.module.order,
        },
        course: {
          id: lessonInfo.module.course.id,
          title: lessonInfo.module.course.title,
          isPublished: lessonInfo.module.course.isPublished,
        },
        enrolled: isEnrolled,
        instructorView: isInstructor,
      },
      "Lesson details fetched successfully",
    ),
  );
});

const getLessonProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) throw new ApiError(400, "Lesson ID is required");

  const lessonInfo = await db.lesson.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      contentType: true,
      contentUrl: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      progress: userId
        ? {
            select: {
              completed: true,
              completedAt: true,
            },
          }
        : undefined,
      module: {
        select: {
          id: true,
          title: true,
          order: true,
          course: {
            select: {
              id: true,
              title: true,
              isPublished: true,
              createdById: true,
            },
          },
        },
      },
    },
  });

  if (!lessonInfo) throw new ApiError(404, "Lesson not found");

  const isInstructor = lessonInfo.module.course.createdById === userId;

  const enrollment = userId
    ? await db.enrollment.findFirst({
        where: { userId, courseId: lessonInfo.module.course.id },
        select: { id: true },
      })
    : null;

  const isEnrolled = !!enrollment;

  if (!isEnrolled && !isInstructor)
    throw new ApiError(
      400,
      "You need to enroll in the course to view this lesson",
    );

  const safeContentUrl =
    isEnrolled || isInstructor ? lessonInfo.contentUrl : null;

  const isCompleted =
    lessonInfo.progress?.length > 0 && lessonInfo.progress[0].completed;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        lesson: {
          id: lessonInfo.id,
          title: lessonInfo.title,
          contentType: lessonInfo.contentType,
          contentUrl: safeContentUrl,
          order: lessonInfo.order,
          createdAt: lessonInfo.createdAt,
          updatedAt: lessonInfo.updatedAt,
          isCompleted,
          completedAt: lessonInfo.progress?.[0]?.completedAt || null,
        },
        module: {
          id: lessonInfo.module.id,
          title: lessonInfo.module.title,
          order: lessonInfo.module.order,
        },
        course: {
          id: lessonInfo.module.course.id,
          title: lessonInfo.module.course.title,
          isPublished: lessonInfo.module.course.isPublished,
        },
        enrolled: isEnrolled,
        instructorView: isInstructor,
      },
      "Lesson progress and details fetched successfully",
    ),
  );
});

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
