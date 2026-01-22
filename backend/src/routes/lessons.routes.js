import { Router } from "express";
import { checkAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  bulkCreateLessons,
  createLesson,
  deleteLesson,
  getAllLessons,
  getLessonById,
  getLessonProgress,
  markLessonCompleted,
  reorderLessons,
  updateLesson,
} from "../controllers/lessons.controllers.js";

const router = Router();

//Public routes
router.route("/getAll/:moduleId").get(isLoggedIn, getAllLessons);

router.route("/getLesson/:id").get(isLoggedIn, getLessonById);

router.route("/getProgress/:id").get(isLoggedIn, getLessonProgress);

router.route("/markCompleted/:id").patch(isLoggedIn, markLessonCompleted);

//Instructor and admin routes
router.route("/create/:moduleId").post(isLoggedIn, checkAdmin, createLesson);

router
  .route("/createBulk/:moduleId")
  .post(isLoggedIn, checkAdmin, bulkCreateLessons);

router.route("/update/:id").patch(isLoggedIn, checkAdmin, updateLesson);

router.route("/delete/:id").delete(isLoggedIn, checkAdmin, deleteLesson);

router
  .route("/reorder/:moduleId")
  .patch(isLoggedIn, checkAdmin, reorderLessons);

export default router;
