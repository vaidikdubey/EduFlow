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

const markLessonCompleted = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { completed = true } = req.body;
  const userId = req.user.id;

  if (!id) throw new ApiError(400, "Lesson ID is required");

  const lesson = await db.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      contentType: true,
      contentUrl: true,
      moduleId: true,
      module: {
        select: {
          courseId: true,
          course: {
            select: { createdById: true },
          },
        },
      },
    },
  });

  if (!lesson) {
    throw new ApiError(404, "Lesson not found");
  }

  const isInstructor = lesson.module.course.createdById === userId;
  let isEnrolled = false;

  if (!isInstructor) {
    const enrollment = await db.enrollment.findFirst({
      where: {
        userId,
        courseId: lesson.module.courseId,
      },
      select: { id: true },
    });
    isEnrolled = !!enrollment;

    if (!isEnrolled) {
      throw new ApiError(
        403,
        "You must be enrolled in the course to mark lessons complete",
      );
    }
  }

  const updatedProgress = await db.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId: id,
      },
    },
    create: {
      userId,
      lessonId: id,
      completed,
      completedAt: completed ? new Date() : null,
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
    },
    select: {
      id: true,
      completed: true,
      completedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        lesson: {
          id: lesson.id,
          title: lesson.title,
          contentType: lesson.contentType,
          contentUrl: lesson.contentUrl,
          moduleId: lesson.moduleId,
        },
        progress: {
          completed: updatedProgress.completed,
          completedAt: updatedProgress.completedAt,
          updatedAt: updatedProgress.updatedAt,
        },
      },
      completed ? "Lesson marked as complete" : "Lesson marked as incomplete",
    ),
  );
});

const createLesson = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user.id;
  const { title, contentType, contentUrl, order } = req.body;

  if (!title) throw new ApiError(400, "Title is required");

  if (!contentType) throw new ApiError(400, "Content type is required");

  if (!["TEXT", "VIDEO", "PDF"].includes(contentType.toUpperCase()))
    throw new ApiError(400, "Invalid content type");

  if (contentType.toLowerCase() !== "text" && !contentUrl)
    throw new ApiError(
      400,
      "contentUrl is required for non-text content types",
    );

  const moduleData = await db.module.findUnique({
    where: { id: moduleId },
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
    },
  });

  if (!moduleData) throw new ApiError(404, "Module not found");

  if (moduleData.course.createdById !== userId)
    throw new ApiError(
      403,
      "You are not authorized to add lesson to this module",
    );

  let lessonOrder = order;
  if (!lessonOrder) {
    const lastLesson = await db.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
  } else if (
    lessonOrder &&
    (!Number.isInteger(lessonOrder) || lessonOrder <= 0)
  )
    throw new ApiError(400, "Order must be a positive integer");

  const newLesson = await db.lesson.create({
    data: {
      title: title.trim(),
      contentType: contentType.toUpperCase(),
      contentUrl: contentUrl || null,
      order: lessonOrder,
      moduleId,
    },
    select: {
      id: true,
      title: true,
      contentType: true,
      contentUrl: true,
      order: true,
      moduleId: true,
      createdAt: true,
    },
  });

  res.status(201).json(new ApiResponse(201, newLesson, "Lesson created"));
});

const bulkCreateLessons = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user.id;
  const { lessons } = req.body; // expected as array: [{ title, contentType, contentUrl, order? }, ...]

  if (!Array.isArray(lessons) || lessons.length === 0) {
    throw new ApiError(400, "Lessons must be a non-empty array");
  }

  lessons.forEach((lesson, index) => {
    if (!lesson.title) {
      throw new ApiError(400, `Lesson at index ${index} is missing title`);
    }
    if (!lesson.contentType) {
      throw new ApiError(
        400,
        `Lesson at index ${index} is missing contentType`,
      );
    }
    if (!['TEXT', 'VIDEO', 'PDF'].includes(contentType.toUpperCase())) {
      throw new ApiError(400, `Invalid content type for lesson at index ${index}`);
    }
    if (lesson.contentType.toLowerCase() !== "text" && !lesson.contentUrl) {
      throw new ApiError(400, `Lesson at index ${index} is missing contentUrl`);
    }
  });

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
        },
      },
    },
  });

  if (!moduleInfo) {
    throw new ApiError(404, "Module not found");
  }

  if (moduleInfo.course.createdById !== userId) {
    throw new ApiError(
      403,
      "You are not authorized to add lessons to this module",
    );
  }

  const lastLesson = await db.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  let nextOrder = lastLesson ? lastLesson.order + 1 : 1;

  // Preparing data for bulk upload
  const lessonDataArray = lessons.map((lesson) => ({
    title: lesson.title.trim(),
    contentType: lesson.contentType.toUpperCase(),
    contentUrl: lesson.contentUrl || null,
    order: lesson.order !== undefined ? Number(lesson.order) : nextOrder++,
    moduleId,
  }));

  const createdLessons = await db.$transaction(
    lessonDataArray.map((data) =>
      db.lesson.create({
        data,
        select: {
          id: true,
          title: true,
          contentType: true,
          contentUrl: true,
          order: true,
          moduleId: true,
          createdAt: true,
        },
      }),
    ),
  );

  res.status(201).json(
    new ApiResponse(
      201,
      {
        moduleId,
        moduleTitle: moduleInfo.title,
        createdLessons,
        totalCreated: createdLessons.length,
      },
      `Successfully created ${createdLessons.length} lesson(s)`,
    ),
  );
});

const updateLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, contentType, contentUrl, order } = req.body;

  if (title && (typeof title !== "string" || title.trim() === "")) {
    throw new ApiError(400, "Title must be a non-empty string");
  }

  if (contentType) {
    if (!["TEXT", "VIDEO", "PDF"].includes(contentType.toUpperCase())) {
      throw new ApiError(400, "Invalid content type");
    }
  }

  if (order) {
    if (!Number.isInteger(order) || order <= 0) {
      throw new ApiError(400, "Order must be a positive integer");
    }
  }

  const existingLesson = await db.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      contentType: true,
      contentUrl: true,
      order: true,
      moduleId: true,
      module: {
        select: {
          courseId: true,
          course: {
            select: {
              createdById: true,
            },
          },
        },
      },
    },
  });

  if (!existingLesson) {
    throw new ApiError(404, "Lesson not found");
  }

  if (existingLesson.module.course.createdById !== userId) {
    throw new ApiError(403, "You are not authorized to update this lesson");
  }

  const lessonData = {};

  if (title) lessonData.title = title.trim();
  if (contentType) lessonData.contentType = contentType.toUpperCase();
  if (contentUrl) lessonData.contentUrl = contentUrl || null;
  if (order) lessonData.order = order;

  if (Object.keys(lessonData).length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          existingLesson,
          "No changes provided - lesson unchanged",
        ),
      );
  }

  const updatedLesson = await db.lesson.update({
    where: { id },
    data: lessonData,
    select: {
      id: true,
      title: true,
      contentType: true,
      contentUrl: true,
      order: true,
      moduleId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, updatedLesson, "Lesson updated successfully"));
});

const deleteLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const deletedLesson = await db.lesson.delete({
    where: {
      id,
      module: {
        course: {
          createdById: userId,
        },
      },
    },
    select: {
      id: true,
      title: true,
      contentType: true,
      contentUrl: true,
      order: true,
      moduleId: true,
    },
  });

  res.status(200).json(new ApiResponse(200, deletedLesson, "Lesson deleted"));
});

const reorderLessons = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user.id;
  const { lessons } = req.body; // expected: [{ id: "uuid", order: number }, ...]

  if (!Array.isArray(lessons) || lessons.length === 0) {
    throw new ApiError(400, "Lessons must be a non-empty array");
  }

  lessons.forEach((item, index) => {
    if (!item.id || typeof item.id !== "string") {
      throw new ApiError(400, `Lesson at index ${index} is missing valid id`);
    }
    if (!Number.isInteger(item.order) || item.order <= 0) {
      throw new ApiError(
        400,
        `Lesson at index ${index} has invalid order (must be positive integer)`,
      );
    }
  });

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
        },
      },
    },
  });

  if (!moduleInfo) {
    throw new ApiError(404, "Module not found");
  }

  if (moduleInfo.course.createdById !== userId) {
    throw new ApiError(
      403,
      "You are not authorized to reorder lessons in this module",
    );
  }

  const providedLessonIds = lessons.map((l) => l.id);

  const existingLessons = await db.lesson.findMany({
    where: {
      id: { in: providedLessonIds },
      moduleId,
    },
    select: { id: true },
  });

  if (existingLessons.length !== providedLessonIds.length) {
    throw new ApiError(
      400,
      "One or more lesson IDs do not belong to this module",
    );
  }

  await db.$transaction(
    lessons.map((lesson) =>
      db.lesson.update({
        where: { id: lesson.id },
        data: { order: lesson.order },
      }),
    ),
  );

  const updatedLessons = await db.lesson.findMany({
    where: { moduleId },
    select: {
      id: true,
      title: true,
      order: true,
      contentType: true,
      contentUrl: true,
    },
    orderBy: { order: "asc" },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        moduleId,
        moduleTitle: moduleInfo.title,
        updatedLessons,
      },
      `Successfully reordered ${updatedLessons.length} lessons`,
    ),
  );
});

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
