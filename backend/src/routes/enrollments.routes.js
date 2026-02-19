import { Router } from "express";
import { checkAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  cancelEnrollment,
  checkCourseCompletionStatus,
  checkEnrollmentStatus,
  enrollInCourse,
  getCourseCertificate,
  getCourseEnrollments,
  getMyEnrollments,
  verifyPayment,
  markCourseCompleted,
  verifyCertificate,
} from "../controllers/enrollments.controllers.js";

const router = Router();

router.route("/enroll/:courseId").post(isLoggedIn, enrollInCourse);

router.route("/enroll/verify").post(isLoggedIn, verifyPayment);

router.route("/enrolled/:courseId").get(isLoggedIn, checkEnrollmentStatus);

router.route("/myEnrollments").get(isLoggedIn, getMyEnrollments);

router.route("/completed/:courseId").patch(isLoggedIn, markCourseCompleted);

router
  .route("/courseStatus/:courseId")
  .get(isLoggedIn, checkCourseCompletionStatus);

router.route("/cancel/:courseId").delete(isLoggedIn, cancelEnrollment);

router
  .route("/certificate/:enrollmentId")
  .get(isLoggedIn, getCourseCertificate);

router.route("/verify/:certificateId").get(verifyCertificate);

router
  .route("/getAllEnrollments/:courseId")
  .get(isLoggedIn, checkAdmin, getCourseEnrollments);

export default router;
