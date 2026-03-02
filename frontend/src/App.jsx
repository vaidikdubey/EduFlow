import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "./pages/auth/LoginPage";
import { Layout } from "./layouts/Layout";
import { HomePage } from "./pages/home/HomePage";
import { useAuthStore } from "./stores/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { CreateCoursePage } from "./pages/courses/CreateCoursePage";
import { UpdateCoursePage } from "./pages/courses/UpdateCoursePage";
import { CourseHomePage } from "./pages/courses/CourseHomePage";
import { AllCoursesPage } from "./pages/courses/All Courses Page/AllCoursesPage";
import { EnrollPage } from "./pages/enrollments/EnrollPage";
import { LessonsPage } from "./pages/lessons/LessonsPage";
import { AttemptQuiz } from "./pages/quiz/AttemptQuiz";
import { CreateLesson } from "./pages/lessons/CreateLesson";
import { CreateBulkLessons } from "./pages/lessons/CreateBulkLessons";
import { UpdateLessonPage } from "./pages/lessons/UpdateLessonPage";
import { QuizAttemptPage } from "./pages/quiz/QuizAttemptPage";
import { QuizSingleAttemptPage } from "./pages/quiz/QuizSingleAttemptPage";
import { CreateQuizPage } from "./pages/quiz/CreateQuizPage";
import { UpdateQuizPage } from "./pages/quiz/UpdateQuizPage";
import { CreateModulePage } from "./pages/modules/CreateModulePage";
import { UpdateModulePage } from "./pages/modules/UpdateModulePage";

function App() {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-pink-500" />
            </div>
        );
    }

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    className:
                        "dark:bg-card dark:text-foreground dark:border-border",
                    style: {
                        background: "var(--foreground)",
                        color: "var(--background)",
                    },
                }}
            />
            <Routes>
                {/* Public Routes */}
                <Route element={<Layout />}>
                    <Route
                        path="/signin"
                        element={
                            authUser ? (
                                <Navigate to={"/"} replace />
                            ) : (
                                <LoginPage />
                            )
                        }
                    />

                    <Route
                        path="/signup"
                        element={
                            !authUser ? (
                                <RegisterPage />
                            ) : (
                                <Navigate to={"/"} replace />
                            )
                        }
                    />

                    <Route
                        path="/verify/:token"
                        element={<VerifyEmailPage />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                    />

                    <Route
                        path="/reset-password/:token"
                        element={<ResetPasswordPage />}
                    />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<HomePage />} />

                        <Route
                            path="/course/create"
                            element={<CreateCoursePage />}
                        />

                        <Route
                            path="/course/update/:id"
                            element={<UpdateCoursePage />}
                        />

                        <Route
                            path="/course/get/:id"
                            element={<CourseHomePage />}
                        />

                        <Route path="/course" element={<AllCoursesPage />} />

                        <Route
                            path="/course/enroll/:id"
                            element={<EnrollPage />}
                        />

                        <Route
                            path="/module/get/:id"
                            element={<LessonsPage />}
                        />

                        <Route
                            path="/quiz/attempt/:id"
                            element={<AttemptQuiz />}
                        />

                        <Route
                            path="/lesson/create/:id"
                            element={<CreateLesson />}
                        />

                        <Route
                            path="/lesson/createBulk/:id"
                            element={<CreateBulkLessons />}
                        />

                        <Route
                            path="/lesson/update/:id"
                            element={<UpdateLessonPage />}
                        />

                        <Route
                            path="/quiz/myAttempts/:id/"
                            element={<QuizAttemptPage />}
                        />

                        <Route
                            path="/quiz/myAttempt/:id/:attemptId"
                            element={<QuizSingleAttemptPage />}
                        />

                        <Route
                            path="/quiz/create"
                            element={<CreateQuizPage />}
                        />

                        <Route
                            path="/quiz/update/:id"
                            element={<UpdateQuizPage />}
                        />

                        <Route
                            path="/module/create/:courseId"
                            element={<CreateModulePage />}
                        />

                        <Route
                            path="/module/update/:id"
                            element={<UpdateModulePage />}
                        />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
