import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

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
const getAllCourses = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const courses = await db.course.findMany({
    where: { createdById: id },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      price: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          modules: true,
          enrollments: true,
          quizzes: true,
        },
      },
      instructors: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!courses || courses.length === 0)
    throw new ApiError(404, "No courses found");

  res
    .status(200)
    .json(new ApiResponse(200, courses, "All created courses fetched"));
});

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, type, price, instructorIds } = req.body;
  const userId = req.user.id;

  if (!title) throw new ApiError(400, "Title is required");

  if (!type) throw new ApiError(400, "Type is required");

  if (!["FREE", "PAID"].includes(type))
    throw new ApiError(400, "Invalid course type");

  if (type === "PAID") {
    if (!price || typeof price !== "number" || price <= 0)
      throw new ApiError(400, "Invalid course price");
  } else if (price) {
    throw new ApiError(400, "Price should not be set for free courses");
  }

  let validInstructors = [];
  if (
    instructorIds &&
    Array.isArray(instructorIds) &&
    instructorIds.length > 0
  ) {
    validInstructors = await db.user.findMany({
      where: {
        id: { in: instructorIds },
        role: "INSTRUCTOR",
      },
      select: {
        id: true,
      },
    });

    if (validInstructors.length !== instructorIds.length)
      throw new ApiError(
        400,
        "One or more instructor IDs are invalid or not instructors",
      );
  }

  const courseData = {
    title,
    description: description || null,
    type,
    price: type === "PAID" ? price : null,
    isPublished: false,
    createdById: userId,
    instructors:
      Array.isArray(instructorIds) && instructorIds.length > 0
        ? {
            connect: validInstructors.map((inst) => ({ id: inst.id })),
          }
        : undefined,
  };

  const newCourse = await db.course.create({
    data: courseData,
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      price: true,
      isPublished: true,
      createdAt: true,
      createdById: true,
      instructors: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  res.status(201).json(new ApiResponse(201, newCourse, "Course created"));
});

const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { title, description, type, price, instructorIds } = req.body;

  const existingCourse = await db.course.findUnique({
    where: { id },
    select: {
      id: true,
      createdById: true,
      isPublished: true,
    },
  });

  if (!existingCourse) throw new ApiError(404, "Course not found");

  if (existingCourse.createdById !== userId)
    throw new ApiError(403, "You are not authorized to update this course");

  if (type && !["FREE", "PAID"].includes(type))
    throw new ApiError(400, "Invalid course type");

  if (type === "PAID") {
    if (!price || typeof price !== "number" || price <= 0)
      throw new ApiError(400, "Invalid course price");
  } else if (price) {
    throw new ApiError(400, "Price should not be set for free courses");
  }

  const courseData = {};

  if (title) courseData.title = title;
  if (description) courseData.description = description;
  if (type) courseData.type = type;
  if (price) courseData.price = type === "PAID" ? price : null;

  if (
    instructorIds &&
    Array.isArray(instructorIds) &&
    instructorIds.length > 0
  ) {
    let validInstructors = [];
    validInstructors = await db.user.findMany({
      where: {
        id: { in: instructorIds },
        role: "INSTRUCTOR",
      },
      select: {
        id: true,
      },
    });

    if (validInstructors.length !== instructorIds.length)
      throw new ApiError(
        400,
        "One or more instructor IDs are invalid or not instructors",
      );

    courseData.instructors = {
      set: validInstructors.map((inst) => ({ id: inst.id })),
    };
  }

  if (Object.keys(courseData).length === 0)
    throw new ApiError(400, "No fields provided to update");

  const updatedCourse = await db.course.update({
    where: { id },
    data: courseData,
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      price: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      createdById: true,
      instructors: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  res.status(200).json(new ApiResponse(200, updatedCourse, "Course updated"));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const deletedCourse = await db.course.delete({
    where: {
      id,
      createdById: userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      price: true,
      isPublished: true,
    },
  });

  if (!deletedCourse) throw new ApiError(400, "Invalid course id");

  res
    .status(200)
    .json(new ApiResponse(200, deletedCourse, "Course deleted successfully"));
});

const publishCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { isPublished } = req.body;

  if (!isPublished) throw new ApiError(400, "Publish status is required");

  if (typeof isPublished !== "boolean")
    throw new ApiError(400, "Publish status should be boolean");

  const publishedCourse = await db.course.update({
    where: {
      id,
      createdById: userId,
    },
    data: { isPublished },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      price: true,
      isPublished: true,
      updatedAt: true,
    },
  });

  const action = isPublished ? "published" : "unpublished";

  res
    .status(200)
    .json(new ApiResponse(200, publishedCourse, `Course ${action}`));
});

const getAllCourseEnrollments = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const courseEnrollments = await db.course.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      type: true,
      price: true,
      isPublished: true,
      _count: {
        select: { enrollment: true },
      },
      enrollments: {
        select: {
          id: true,
          enrolledAt: true,
          completed: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      },
    },
  });

  if (!courseEnrollments) throw new ApiError(404, "Course not found");

  res
    .status(200)
    .json(new ApiResponse(200, courseEnrollments, "Enrollments fetched"));
});

const getAllInstructors = asyncHandler(async (req, res) => {
  const allInstructors = await db.user.findMany({
    where: {
      role: "INSTRUCTOR",
    },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  });

  if (!allInstructors || allInstructors.length === 0)
    throw new ApiError(404, "No instructors found");

  res
    .status(200)
    .json(new ApiResponse(200, allInstructors, "Instructors list fetched"));
});

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
  getAllInstructors,
};
