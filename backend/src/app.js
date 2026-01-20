import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Content-Disposition"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Custom routes import
import authRouter from "./routes/auth.routes.js"
import courseRouter from "./routes/courses.routes.js"
import moduleRouter from "./routes/modules.routes.js"
import lessonRouter from "./routes/lessons.routes.js"
import enrollmentRouter from "./routes/enrollments.routes.js"
import quizRouter from "./routes/quizzes.routes.js"
import healthCheckRouter from "./routes/healthcheck.routes.js";

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/module", moduleRouter)
app.use("/api/v1/lesson", lessonRouter)
app.use("/api/v1/enrollment", enrollmentRouter)
app.use("/api/v1/quiz", quizRouter)
app.use("/api/v1/healthcheck", healthCheckRouter)

// Any error thrown in routes above will end up here
app.use(errorHandler);

export default app;
