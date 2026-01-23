import { Router } from "express";
import { checkAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createQuiz,
  deleteQuiz,
  getAllQuizAttempts,
  getMyQuizAttempts,
  getQuizById,
  getQuizzesByCourse,
  getQuizzesByModule,
  submitQuizAttempt,
  updateQuiz,
} from "../controllers/quizzes.controllers.js";

const router = Router();

//Public routes
router.route("/quizByModule/:moduleId").get(isLoggedIn, getQuizzesByModule);

router.route("/quizByCourse/:courseId").get(isLoggedIn, getQuizzesByCourse);

router.route("/getQuiz/:id").get(isLoggedIn, getQuizById);

router.route("/submit/:quizId").post(isLoggedIn, submitQuizAttempt);

router.route("/getQuizAttempt/:quizId").get(isLoggedIn, getMyQuizAttempts);

//Instructor and admin routes
router.route("/create/:moduleId").post(isLoggedIn, checkAdmin, createQuiz);

router.route("/update/:quizId").patch(isLoggedIn, checkAdmin, updateQuiz);

router.route("/delete/:quizId").delete(isLoggedIn, checkAdmin, deleteQuiz);

router
  .route("/getAllAttempts/:quizId")
  .get(isLoggedIn, checkAdmin, getAllQuizAttempts);

export default router;
