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
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
