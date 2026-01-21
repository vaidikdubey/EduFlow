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

const getModuleProgress = asyncHandler(async (req, res) => {});

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
