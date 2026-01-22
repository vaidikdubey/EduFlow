import { Router } from "express";
import { checkAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  cancelEnrollment,
  checkEnrollmentStatus,
  enrollInCourse,
  getCourseCertificate,
  getCourseEnrollments,
  getEnrollmentById,
  getMyEnrollments,
  handleRazorpayWebhook,
  markCourseCompleted,
} from "../controllers/enrollments.controllers.js";

const router = Router();

router.route("/enroll/:courseId").post(isLoggedIn, enrollInCourse);

//Razorpay payment route
router.route("/webhook/razorpay").post(handleRazorpayWebhook);

router.route("/enrolled/:courseId").get(isLoggedIn, checkEnrollmentStatus);

router.route("/myEnrollments").get(isLoggedIn, getMyEnrollments);

router.route("/completed/:id").patch(isLoggedIn, markCourseCompleted);

router.route("/cancel/:courseId").delete(isLoggedIn, cancelEnrollment);

router.route("/getEnrollment/:courseId").get(isLoggedIn, getEnrollmentById);

router.route("/certificate/:courseId").post(isLoggedIn, getCourseCertificate);

router
  .route("/getAll/:courseId")
  .get(isLoggedIn, checkAdmin, getCourseEnrollments);

export default router;
