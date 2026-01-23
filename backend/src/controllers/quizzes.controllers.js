import { db } from "../db/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getQuizzesByModule = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user.id;

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
          isPublished: true,
        },
      },
    },
  });

  if (!moduleInfo) throw new ApiError(404, "Module not found");

  const isInstructor = moduleInfo.course.createdById === userId;
  let isEnrolled = false;

  if (!isInstructor) {
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
    throw new ApiError(
      403,
      "You need to enroll in this course to view module quizzes",
    );

  const quizzes = await db.quiz.findMany({
    where: { moduleId },
    select: {
      id: true,
      title: true,
      courseId: true,
      moduleId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          attempts: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        module: {
          id: moduleInfo.id,
          title: moduleInfo.title,
          courseId: moduleInfo.courseId,
          courseTitle: moduleInfo.course.title,
        },
        quizzes,
        totalQuizzes: quizzes.length,
      },
      quizzes.length
        ? "Quizzes fetched successfully"
        : "No quizzes available in this module yet",
    ),
  );
});

const getQuizzesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const courseInfo = await db.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdById: true,
      type: true,
      price: true,
      isPublished: true,
    },
  });

  if (!courseInfo || !courseInfo.isPublished)
    throw new ApiError(404, "Course not found");

  const isInstructor = courseInfo.createdById === userId;
  let isEnrolled;

  if (!isInstructor) {
    const enrollData = await db.enrollment.findFirst({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      select: {
        id: true,
      },
    });

    isEnrolled = !!enrollData;
  }

  if (!isInstructor && !isEnrolled)
    throw new ApiError(
      403,
      "You need to enroll in this course to view quizzes",
    );

  const quizzes = await db.quiz.findMany({
    where: { courseId },
    select: {
      id: true,
      title: true,
      courseId: true,
      moduleId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          attempts: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        course: {
          id: courseInfo.id,
          title: courseInfo.title,
          description: courseInfo.description,
          type: courseInfo.type,
          price: courseInfo.price,
          isPublished: courseInfo.isPublished,
        },
        quizzes,
        totalQuizzes: quizzes.length,
      },
      quizzes.length
        ? "Quizzes fetched successfully"
        : "No quizzes available in this course yet",
    ),
  );
});

const getQuizById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const quiz = await db.quiz.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      courseId: true,
      moduleId: true,
      createdAt: true,
      updatedAt: true,
      questions: true,
      _count: {
        select: { attempts: true },
      },
      course: {
        select: {
          id: true,
          title: true,
          isPublished: true,
          createdById: true,
        },
      },
      module: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!quiz || !quiz.course.isPublished)
    throw new ApiError(404, "Quiz not found");

  const isInstructor = quiz.course.createdById === userId;
  let isEnrolled;

  if (!isInstructor) {
    const enrollment = await db.enrollment.findFirst({
      where: {
        userId_courseId: {
          userId,
          courseId: quiz.course.id,
        },
      },
      select: { id: true },
    });

    isEnrolled = !!enrollment;
  }

  if (!isInstructor && !isEnrolled)
    throw new ApiError(
      403,
      "You need to enroll in this course to access this quiz",
    );

  const responseData = {
    ...quiz,
    isInstructor,
    isEnrolled,
    totalAttempts: quiz._count.attempts,
    module: quiz.module,
  };

  delete responseData.course.createdById;

  res.status(200).json(new ApiResponse(200, responseData, "Quiz fetched"));
});

const submitQuizAttempt = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user.id;
  const { answers } = req.body;

  const existingQuiz = await db.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      title: true,
      courseId: true,
      moduleId: true,
      questions: true,
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

  if (!existingQuiz) throw new ApiError(404, "Quiz not found");

  if (!existingQuiz.course.isPublished)
    throw new ApiError(400, "This course is not yet published");

  const isInstructor = existingQuiz.course.createdById === userId;
  let isEnrolled;

  if (!isInstructor) {
    const enrollment = await db.enrollment.findFirst({
      where: {
        userId_courseId: {
          userId,
          courseId: quiz.course.id,
        },
      },
      select: { id: true },
    });

    isEnrolled = !!enrollment;
  }

  if (!isInstructor && !isEnrolled)
    throw new ApiError(
      403,
      "You need to enroll in this course to access this quiz",
    );

  if (
    !Array.isArray(answers) ||
    answers.length !== existingQuiz.questions.length
  )
    throw new ApiError(
      400,
      "Answer must be an array of same size as questions",
    );

  let score = 0;

  for (let i = 0; i < existingQuiz.questions.length; i++) {
    const question = existingQuiz.question[i];
    const submittedAnswer = answers[i];

    const correctAnswer = question.correct;

    let submittedValue;
    if (typeof submittedAnswer === "number") {
      submittedValue = submittedAnswer;
    } else if (typeof submittedAnswer === "string") {
      submittedValue = submittedAnswer.toUpperCase().charCodeAt(0) - 65;
    } else {
      continue; //Invalid answer
    }

    if (submittedValue === correctAnswer) score++;
  }

  const newQuizAttempt = await db.QuizAttempt.create({
    data: {
      userId,
      quizId,
      score,
      answers,
      attemptedAt: new Date(),
    },
    select: {
      id: true,
      userId: true,
      quizId: true,
      score: true,
      attemptedAt: true,
    },
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        attempt: newQuizAttempt,
        score,
        totalQuestions: existingQuiz.question.length,
        percentage: Math.round((score / existingQuiz.question.length) * 100),
      },
      "Quiz submitted and graded successfully",
    ),
  );
});

const getMyQuizAttempts = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user.id;

  const quiz = await db.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      title: true,
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

  if (!quiz) throw new ApiError(404, "Quiz not found");

  const isInstructor = quiz.course.createdById === userId;
  let isEnrolled = false;

  if (!isInstructor) {
    const enrollment = await db.enrollment.findFirst({
      where: {
        userId_courseId: {
          userId,
          courseId: quiz.courseId,
        },
      },
      select: { id: true },
    });

    isEnrolled = !!enrollment;
  }

  if (!isInstructor && !isEnrolled) {
    throw new ApiError(
      403,
      "You need to enroll in this course to view your quiz attempts",
    );
  }

  const myAttempts = await db.quizAttempt.findMany({
    where: {
      quizId,
      userId,
    },
    select: {
      id: true,
      score: true,
      attemptedAt: true,
      createdAt: true,
      updatedAt: true,
      answers: true,
    },
    orderBy: { attemptedAt: "desc" },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        myAttempts,
        myAttempts.length
          ? "Your quiz attempts fetched successfully"
          : "You haven't attempted this quiz yet",
      ),
    );
});

const createQuiz = asyncHandler(async (req, res) => {});

const updateQuiz = asyncHandler(async (req, res) => {});

const deleteQuiz = asyncHandler(async (req, res) => {});

const getAllQuizAttempts = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user.id;

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      title: true,
      courseId: true,
      moduleId: true,
      createdAt: true,
      updatedAt: true,
      course: {
        select: {
          id: true,
          title: true,
          createdById: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const isInstructor = quiz.course.createdById === userId;
  if (!isInstructor && req.user.role !== "ADMIN") {
    throw new ApiError(
      403,
      "Only the course instructor or admin can view all quiz attempts",
    );
  }

  const attempts = await db.quizAttempt.findMany({
    where: { quizId },
    select: {
      id: true,
      userId: true,
      score: true,
      attemptedAt: true,
      createdAt: true,
      updatedAt: true,
      answers: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { attemptedAt: "desc" },
  });

  const totalAttempts = attempts.length;
  const totalScoreSum = attempts.reduce((sum, a) => sum + a.score, 0);
  const avgScore =
    totalAttempts > 0 ? (totalScoreSum / totalAttempts).toFixed(2) : 0;

  const responseData = {
    quiz: {
      id: quiz.id,
      title: quiz.title,
      courseId: quiz.courseId,
      moduleId: quiz.moduleId,
      courseTitle: quiz.course.title,
    },
    summary: {
      totalAttempts,
      averageScore: avgScore,
      highestScore:
        attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0,
    },
    attempts: attempts.map((attempt) => ({
      id: attempt.id,
      user: {
        id: attempt.user.id,
        name: attempt.user.name,
        email: attempt.user.email,
        image: attempt.user.image,
      },
      score: attempt.score,
      attemptedAt: attempt.attemptedAt,
      answers: attempt.answers,
    })),
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responseData,
        totalAttempts
          ? "All quiz attempts fetched successfully"
          : "No attempts recorded for this quiz yet",
      ),
    );
});

export {
  getQuizzesByModule,
  getQuizzesByCourse,
  getQuizById,
  submitQuizAttempt,
  getMyQuizAttempts,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getAllQuizAttempts,
};
