import { useAuthStore } from "@/store/useAuthStore";
import { Loader } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
    const { authUser, isCheckingAuth } = useAuthStore();
    const location = useLocation();

    if (isCheckingAuth) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-pink-500" />
            </div>
        );
    }

    if (!isCheckingAuth && !authUser) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};
