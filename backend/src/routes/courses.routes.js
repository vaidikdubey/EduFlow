import { Router } from "express";
import { isLoggedIn, checkAdmin } from "../middlewares/auth.middleware.js";
import { checkUserEnrolled, createCourse, deleteCourse, getAllCourseEnrollments, getAllCourses, getAllPublishedCourses, getCourseById, getCourseProgress, publishCourse, updateCourse } from "../controllers/courses.controllers.js";

const router = Router();

//For all users
router.route("/getPublished").get(isLoggedIn, getAllPublishedCourses);

router.route("/getCourse/:id").get(isLoggedIn, getCourseById);

router.route("/progress/:id").get(isLoggedIn, getCourseProgress);

router.route("/enrolled/:id").get(isLoggedIn, checkUserEnrolled);

//For instructors and admins
router.route("/instructor/getAll").get(isLoggedIn, checkAdmin, getAllCourses);

router.route("/instructor/create").post(isLoggedIn, checkAdmin, createCourse);

router
  .route("/instructor/update/:id")
  .patch(isLoggedIn, checkAdmin, updateCourse);

router
  .route("/instructor/delete/:id")
  .delete(isLoggedIn, checkAdmin, deleteCourse);

router
  .route("/instructor/publish/:id")
  .patch(isLoggedIn, checkAdmin, publishCourse);

router
  .route("/instructor/enrollments/:id")
  .get(isLoggedIn, checkAdmin, getAllCourseEnrollments);

export default router;
