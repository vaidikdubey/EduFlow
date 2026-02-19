import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

  await db.enrollment.create({
    data: {
      userId,
      courseId,
      paymentStatus: "pending",
      amount: course.price,
      paymentId: razorpayOrder.id,
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

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  // 1. Verify the signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  // 2. Find and Update the enrollment using the order_id
  // We don't need 'notes' here because we saved the orderId in DB during 'enroll'
  const updatedEnrollment = await db.enrollment.update({
    where: {
      paymentId: razorpay_order_id,
    },
    data: {
      paymentStatus: "captured",
      paidAt: new Date(),
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedEnrollment, "Payment verified successfully"),
    );
});

const checkEnrollmentStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  if (!courseId) throw new ApiError(400, "Course ID is required");

  const courseExists = await db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      isPublished: true,
    },
  });

  if (!courseExists || !courseExists.isPublished)
    throw new ApiError(404, "Course not found");

  const enrollmentData = await db.enrollment.findUnique({
    where: {
      userId,
      courseId,
    },
    select: {
      id: true,
      enrolledAt: true,
      completed: true,
      completedAt: true,
      paidAt: true,
      paymentId: true,
      amount: true,
      paymentStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const isPaid =
    !!enrollmentData.paidAt || enrollmentData.paymentStatus === "captured";

  if (!enrollmentData)
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          enrollmentStatus: false,
          isPaid,
          course: {
            id: courseExists.id,
            title: courseExists.title,
          },
        },
        `You are not enrolled in ${courseExists.title} course`,
      ),
    );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        enrollmentStatus: true,
        isPaid,
        enrollmentData,
      },
      `You are enrolled in ${courseExists.title} course`,
    ),
  );
});

const getMyEnrollments = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const enrolledCourses = await db.enrollment.findMany({
    where: { userId },
    select: {
      id: true,
      courseId: true,
      enrolledAt: true,
      completed: true,
      completedAt: true,
      paidAt: true,
      paymentId: true,
      amount: true,
      paymentStatus: true,
      createdAt: true,
      updatedAt: true,
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          price: true,
          createdAt: true,
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  if (!enrolledCourses || enrolledCourses.length === 0)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { message: "You are not enrolled in any course" },
          "You are not enrolled in any course",
        ),
      );

  res
    .status(200)
    .json(new ApiResponse(200, enrolledCourses, "Enrolled courses fetched"));
});

const markCourseCompleted = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { completed = true } = req.body;
  const userId = req.user.id;

  if (!courseId) throw new ApiError(404, "Course ID is required");

  const enrollmentCheck = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    select: {
      id: true,
      enrolledAt: true,
    },
  });

  if (!enrollmentCheck)
    throw new ApiError(404, "Course not found or you are not enrolled yet");

  const markCourseAsCompleted = await db.enrollment.update({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
    },
    select: {
      id: true,
      enrolledAt: true,
      completed: true,
      paidAt: true,
      paymentId: true,
      amount: true,
      paymentStatus: true,
      createdAt: true,
      updatedAt: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  const message = completed
    ? "Course marked as completed"
    : "Course marked as incomplete";

  res.status(200).json(new ApiResponse(200, markCourseAsCompleted, message));
});

const checkCourseCompletionStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  if (!courseId) throw new ApiError(404, "Course ID is required");

  const enrollmentCheck = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    select: {
      id: true,
      enrolledAt: true,
      completed: true,
      completedAt: true,
    },
  });

  if (!enrollmentCheck)
    throw new ApiError(404, "Course not found or you are not enrolled");

  const message = enrollmentCheck.completed
    ? "Course completed"
    : "Course incomplete";

  res.status(200).json(
    new ApiResponse(
      200,
      {
        completionStatus: enrollmentCheck.completed,
        enrollmentCheck,
      },
      message,
    ),
  );
});

const cancelEnrollment = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId,
      courseId,
    },
    select: {
      id: true,
      enrolledAt: true,
      paidAt: true,
      paymentStatus: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!enrollment) {
    throw new ApiError(404, "You are not enrolled in this course");
  }

  if (enrollment.completed) {
    throw new ApiError(400, "Cannot cancel a completed course");
  }

  if (enrollment.paidAt && enrollment.paymentStatus === "captured") {
    // For practice/test mode → allow cancel
    // In real production → include refund logic via Razorpay API
    console.warn(
      `Canceling paid enrollment: ${enrollment.id} (no refund in test mode)`,
    );
  }

  const deletedEnrollment = await db.enrollment.delete({
    where: {
      userId,
      courseId,
    },
    select: {
      id: true,
      courseId: true,
      enrolledAt: true,
      paidAt: true,
    },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        deletedEnrollment: {
          id: deletedEnrollment.id,
          courseId: deletedEnrollment.courseId,
          courseTitle: enrollment.course.title,
        },
      },
      "Successfully canceled enrollment",
    ),
  );
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getCourseCertificate = asyncHandler(async (req, res) => {
  const { enrollmentId } = req.params;
  const userId = req.user.id;

  const enrollment = await db.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true } },
    },
  });

  if (!enrollment || enrollment.userId !== userId) {
    throw new ApiError(403, "Unauthorized access to this enrollment");
  }

  if (!enrollment.completed) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: false },
          "Course must be completed to generate certificate",
        ),
      );
  }

  let certificate = await db.certificate.findUnique({
    where: { enrollmentId },
  });

  if (!certificate) {
    const certificateId = `CERT-${enrollmentId.slice(0, 8).toUpperCase()}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;

    certificate = await db.certificate.create({
      data: {
        enrollmentId,
        courseId: enrollment.courseId,
        certificateId,
      },
    });

    // Generate PDF with QR code
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const pdfPath = path.join(
      __dirname,
      `../public/certificates/${certificate.certificateId}.pdf`,
    );

    fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

    doc.pipe(fs.createWriteStream(pdfPath));

    // Certificate layout
    doc
      .fontSize(28)
      .text("Certificate of Completion", { align: "center" })
      .moveDown(1.5);

    doc
      .fontSize(18)
      .text("This certifies that", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(24)
      .text(enrollment.user.name.toUpperCase(), { align: "center", bold: true })
      .moveDown(1);

    doc
      .fontSize(16)
      .text("has successfully completed", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(22)
      .text(enrollment.course.title, { align: "center", bold: true })
      .moveDown(1.5);

    doc
      .fontSize(14)
      .text(`Issued on ${new Date().toLocaleDateString("en-IN")}`, {
        align: "center",
      })
      .moveDown(1);

    doc
      .fontSize(12)
      .text(`Certificate ID: ${certificate.certificateId}`, { align: "center" })
      .moveDown(1);

    doc.fontSize(12).text("EduFlow Learning Platform", { align: "center" });

    // Generate QR code
    const verificationUrl = `${process.env.BASE_URL}/api/v1/enrollment/verify/${certificate.certificateId}`;
    const qrBuffer = await QRCode.toBuffer(verificationUrl, {
      width: 120, // size in pixels
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });

    // Place QR code in bottom-right
    doc.image(qrBuffer, 420, 650, { align: "center", width: 120 });

    // Small text under QR
    doc.fontSize(10).text("Scan to verify", 440, 780, { align: "center" });

    doc.end();

    // Wait for PDF to finish writing
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const pdfPath = path.join(
    __dirname,
    `../public/certificates/${certificate.certificateId}.pdf`,
  );

  if (!fs.existsSync(pdfPath)) {
    throw new ApiError(500, "Failed to generate certificate file");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="Certificate_${certificate.certificateId}.pdf"`,
  );

  const fileStream = fs.createReadStream(pdfPath);
  fileStream.pipe(res);
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;

  const certificate = await db.certificate.findUnique({
    where: {
      certificateId,
    },
    include: {
      enrollment: {
        include: {
          user: { select: { name: true } },
          course: { select: { title: true } },
        },
      },
    },
  });

  if (!certificate) throw new ApiError(404, "Certificate not found or invalid");

  res.status(200).json(
    new ApiResponse(
      200,
      {
        valid: true,
        certificateId,
        issuedAt: certificate.issuedAt,
        studentName: certificate.enrollment.user.name,
        courseTitle: certificate.enrollment.course.title,
      },
      "Certificate verified successfully",
    ),
  );
});

const getCourseEnrollments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const courseDetails = await db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      createdById: true,
      type: true,
      price: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      enrollments: {
        select: {
          id: true,
          userId: true,
          courseId: true,
          enrolledAt: true,
          completed: true,
          completedAt: true,
          paidAt: true,
          paymentId: true,
          amount: true,
          paymentStatus: true,
          createdAt: true,
          updatedAt: true,
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
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!courseDetails) throw new ApiError(404, "Course not found");

  if (req.user.role !== "ADMIN" && courseDetails.createdById !== userId)
    throw new ApiError(403, "You are not authorized to view all enrollments");

  const responseData = {
    course: {
      id: courseDetails.id,
      title: courseDetails.title,
      description: courseDetails.description,
      type: courseDetails.type,
      price: courseDetails.price,
      isPublished: courseDetails.isPublished,
      totalEnrollments: courseDetails._count.enrollments,
    },
    enrollments: courseDetails.enrollments.map((en) => ({
      id: en.id,
      enrolledAt: en.enrolledAt,
      completed: en.completed,
      completedAt: en.completedAt,
      paidAt: en.paidAt,
      paymentStatus: en.paymentStatus,
      amount: en.amount,
      user: {
        id: en.user.id,
        name: en.user.name,
        image: en.user.image,
      },
    })),
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responseData,
        courseDetails.enrollments.length
          ? "Course enrollments fetched"
          : "No enrollments in this course yet",
      ),
    );
});

export {
  enrollInCourse,
  verifyPayment,
  checkEnrollmentStatus,
  getMyEnrollments,
  markCourseCompleted,
  checkCourseCompletionStatus,
  cancelEnrollment,
  getCourseCertificate,
  verifyCertificate,
  getCourseEnrollments,
};
