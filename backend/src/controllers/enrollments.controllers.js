import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import crypto from "crypto";
import razorpay from "razorpay";

const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const existingEnrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existingEnrollment)
    throw new ApiError(409, "You are already enrolled in this course");

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      type: true,
      price: true,
      isPublished: true,
    },
  });

  if (!course || !course.isPublished)
    throw new ApiError(404, "Course not found");

  if (course.type === "FREE") {
    const newEnrollment = await db.enrollment.create({
      data: {
        userId,
        courseId,
      },
      select: {
        id: true,
        enrolledAt: true,
        completed: true,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newEnrollment, "Successfully enrolled"));
  }

  if (course.type === "PAID" && (!course.price || course.price < 0))
    throw new ApiError(400, "Invalid course price");

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(course.price * 100),
    currency: "INR",
    receipt: `rcpt_${req.user.id.toString().slice(-6)}_${Math.floor(Math.random() * 10000)}`,
    notes: {
      userId,
      courseId,
      courseTitle: course.title,
    },
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        razorpay_details: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          courseId,
          courseTitle: course.title,
          key: process.env.RAZORPAY_KEY_ID,
        },
      },
      "Razorpay order created - proceed to payment",
    ),
  );
});

const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const body = req.body; //raw body Buffer

  //Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body.toString())
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Invalid razorpay webhook signature");
    return res.status(400).json({ error: "Invalid signature" });
  }

  //Parse event
  const event = JSON.parse(body.toString());

  //Handle event
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const { notes } = payment;

    const userId = notes.userId;
    const courseId = notes.courseId;

    if (!userId || !courseId) {
      console.error("Missing notes in Razorpay payment");
      return res.status(200).json({ status: "ok" });
    }

    //Update enrollment
    const updatedEnrollment = await db.enrollment.update({
      where: {
        userId_courseId: { userId, courseId },
      },
      data: {
        paidAt: new Date(),
        paymentId: payment.id,
        amount: Number(payment.amount) / 100,
        paymentStatus: "captured",
      },
      select: {
        id: true,
        userId: true,
        courseId: true,
        enrolledAt: true,
        paidAt: true,
        paymentId: true,
        amountPaid: true,
        paymentStatus: true,
      },
    });

    console.log(`Enrollment successful: user ${userId} → course ${courseId}`);
  }

  //Always respond Razorpay with 200 else they retry
  res.status(200).json({ status: "ok" });
});

const checkEnrollmentStatus = asyncHandler(async (req, res) => {});

const getMyEnrollments = asyncHandler(async (req, res) => {});

const markCourseCompleted = asyncHandler(async (req, res) => {});

const cancelEnrollment = asyncHandler(async (req, res) => {});

const getEnrollmentById = asyncHandler(async (req, res) => {});

const getCourseCertificate = asyncHandler(async (req, res) => {});

const getCourseEnrollments = asyncHandler(async (req, res) => {});

export {
  enrollInCourse,
  handleRazorpayWebhook,
  checkEnrollmentStatus,
  getMyEnrollments,
  markCourseCompleted,
  cancelEnrollment,
  getEnrollmentById,
  getCourseCertificate,
  getCourseEnrollments,
};
