import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getAllModules = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) throw new ApiError(400, "Course id is required");

  const allModules = await db.module.findMany({
    where: { courseId },
    select: {
      id: true,
      title: true,
      order: true,
      courseId: true,
      _count: {
        select: {
          lessons: true,
          quiz: true,
        },
      },
    },
    orderBy: { order: "asc" },
  });

  res.status(200).json(new ApiResponse(200, allModules, "All modules fetched"));
});

const getModuleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) throw new ApiError(400, "Module id is required");

  const module = await db.module.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          isPublished: true,
        },
      },
      lessons: {
        select: {
          id: true,
          title: true,
          contentType: true,
          contentUrl: true,
          order: true,
          progress: userId
            ? {
                where: { userId },
                select: {
                  completed: true,
                  completedAt: true,
                },
              }
            : undefined,
        },
        orderBy: { order: "asc" },
      },
      _count: {
        select: { lessons: true },
      },
    },
  });

  if (!module) throw new ApiError(404, "No module found");

  res.status(200).json(new ApiResponse(200, module, "Module fetched"));
});

const getModuleProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const moduleData = await db.module.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      order: true,
      courseId: true,
      course: {
        select: {
          id: true,
          title: true,
          createdById: true,
        },
      },
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
            where: { userId },
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
  });

  if (!moduleData) throw new ApiError(404, "Module not found");

  const isInstructor = module.course.createdById === userId;

  if (isInstructor)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { message: "Progress tracking is for students only" },
          "Instructor view - no personal progress",
        ),
      );

  const enrollment = await db.enrollment.findFirst({
    where: {
      userId,
      courseId: module.courseId,
    },
    select: {
      id: true,
      enrolledAt: true,
      completed: true,
    },
  });

  if (!enrollment)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { enrolled: false },
          "You must be enrolled in the course to view progress",
        ),
      );

  const totalLessons = moduleData._count.lessons;
  let completedLessons = 0;

  moduleData.lessons.forEach((lesson) => {
    if (lesson.progress.length > 0 && lesson.progress[0].completed) {
      completedLessons++;
    }
  });

  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const lessonData = moduleData.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    order: lesson.order,
    isCompleted: lesson.progress.length > 0 && lesson.progress[0].completed,
    completedAt: lesson.progress[0]?.completedAt || null,
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        module: {
          id: moduleData.id,
          title: moduleData.title,
          order: moduleData.order,
          totalLessons,
        },
        course: {
          id: moduleData.course.id,
          title: moduleData.course.title,
        },
        progress: {
          completedLessons,
          totalLessons,
          progressPercentage,
          completed: progressPercentage === 100,
        },
        lessons: lessonData,
        enrolled: true,
      },
      "Module progress fetched",
    ),
  );
});

const createModule = asyncHandler(async (req, res) => {});

const updateModule = asyncHandler(async (req, res) => {});

const deleteModule = asyncHandler(async (req, res) => {});

const getModuleStats = asyncHandler(async (req, res) => {});

export {
  getAllModules,
  getModuleById,
  getModuleProgress,
  createModule,
  updateModule,
  deleteModule,
  getModuleStats,
};
