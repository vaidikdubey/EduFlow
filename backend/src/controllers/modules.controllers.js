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
  });

  if (!moduleData) throw new ApiError(404, "Module not found");

  const isInstructor = moduleData.course.createdById === userId;

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
      courseId: moduleData.courseId,
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

const createModule = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, order } = req.body;

  if (!title) throw new ApiError(400, "Title is required");

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      createdById: true,
    },
  });

  if (!course) throw new ApiError(404, "Course not found");

  if (course.createdById !== req.user.id)
    throw new ApiError(
      403,
      "You are not authorized to add modules to this course",
    );

  let moduleOrder = order;
  if (!moduleOrder) {
    const lastModule = await db.module.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    moduleOrder = lastModule ? lastModule.order + 1 : 1;
  }

  const newModule = await db.module.create({
    data: {
      title,
      order: moduleOrder,
      courseId,
    },
    select: {
      id: true,
      title: true,
      order: true,
      courseId: true,
      createdAt: true,
    },
  });

  res.status(201).json(new ApiResponse(201, newModule, "Module created"));
});

const updateModule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, order } = req.body;
  const userId = req.user.id;

  const existingModule = await db.module.findUnique({
    where: { id },
    select: {
      id: true,
      course: {
        select: {
          createdById: true,
        },
      },
    },
  });

  if (!existingModule) throw new ApiError(404, "Module not found");

  if (existingModule.course.createdById !== userId)
    throw new ApiError(403, "You are not authorized to update this module");

  const moduleData = {};

  if (order) {
    if (order <= 0) throw new ApiError("Order should be a positive integer");
    else moduleData.order = order;
  }

  if (title) moduleData.title = title;

  if (Object.keys(moduleData).length === 0)
    throw new ApiError(400, "No fields provided to update");

  const updatedModule = await db.module.update({
    where: { id },
    data: moduleData,
    select: {
      id: true,
      title: true,
      courseId: true,
      updatedAt: true,
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
          quiz: true,
        },
      },
    },
  });

  res.status(200).json(new ApiResponse(200, updatedModule, "Module updated"));
});

const deleteModule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const deletedModule = await db.module.delete({
    where: {
      id,
      course: {
        createdById: userId,
      },
    },
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
  });

  res.status(200).json(new ApiResponse(200, deletedModule, "Module deleted"));
});

const getModuleStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const moduleData = await db.module.findUnique({
    where: { id },
    select: {
      title: true,
      order: true,
      courseId: true,
      createdAt: true,
      updatedAt: true,
      course: {
        select: {
          createdById: true,
          title: true,
        },
      },
      _count: {
        select: {
          lessons: true,
          quiz: true,
        },
      },
      lessons: {
        select: {
          id: true,
          title: true,
          order: true,
          progress: {
            select: {
              completed: true,
              completedAt: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
      quiz: {
        select: {
          id: true,
          title: true,
          questions: true,
          attempts: {
            select: { id: true },
          },
        },
      },
    },
  });

  if (!moduleData) throw new ApiError(404, "Module not found");

  if (moduleData.course.createdById !== req.user.id)
    throw new ApiError(403, "Only course instructor can view module stats");

  const totalLessons = moduleData._count.lessons;
  const totalQuizzes = moduleData._count.quiz;

  let totalQuestions = 0;
  moduleData.quiz.forEach((q) => {
    totalQuestions += q.questions.length;
  });

  let totalCompletedLessons = 0;

  moduleData.lessons.forEach((lesson) => {
    totalCompletedLessons += lesson.progress.filter((p) => p.completed).length;
  });

  const totalStudentProgressRecords = moduleData.lessons.reduce(
    (sum, lesson) => sum + lesson.progress.length,
    0,
  );

  const avgProgress =
    totalCompletedLessons > 0
      ? Math.round(totalCompletedLessons / totalStudentProgressRecords) * 100
      : 0;

  const progressData = {
    module: {
      id: moduleData.id,
      title: moduleData.title,
      order: moduleData.order,
      courseId: moduleData.courseId,
      courseTitle: moduleData.course.title,
    },
    overallStats: {
      totalLessons,
      totalQuizzes,
      totalQuestions,
      totalCompletedLessons,
      avgStudentProgress: `${avgProgress}%`,
    },
    lessons: {
      total: totalLessons,
      details: moduleData.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        completedByStudents: lesson.progress.filter((p) => p.completed).length,
      })),
    },
    quizzes: {
      total: totalQuizzes,
      details: moduleData.quiz.map((q) => ({
        id: q.id,
        title: q.title,
        totalQuestions: q._count.questions,
        totalAttempts: q._count.attempts,
      })),
    },
  };

  res
    .status(200)
    .json(new ApiResponse(200, progressData, "Module stats fetched"));
});

export {
  getAllModules,
  getModuleById,
  getModuleProgress,
  createModule,
  updateModule,
  deleteModule,
  getModuleStats,
};
