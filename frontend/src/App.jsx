import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore.js";
import { LoaderIcon } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Layout } from "./layouts/Layout.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.jsx";
import { ResetPasswordPage } from "./pages/ResetPasswordPage.jsx";
import { VerifyEmailPage } from "./pages/VerifyEmailPage.jsx";

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderIcon className="animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "dark:bg-card dark:text-foreground dark:border-border",
          style: {
            background: "var(--foreground)",
            color: "var(--background)",
          },
        }}
      />

      <Routes>
        <Route element={<Layout />} />
        {/* Public Routes */}
        <Route
          path="/signin"
          element={authUser ? <Navigate to={"/"} replace /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={!authUser ? <RegisterPage /> : <Navigate to={"/"} replace />}
        />

        <Route path="/verify/:token" element={<VerifyEmailPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
}

export default App;
