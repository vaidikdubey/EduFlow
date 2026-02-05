import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,
    isDeletingUser: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/me");

            set({ authUser: res.data });
        } catch (error) {
            console.error("Error checking auth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post("/auth/login", data);

            toast.success(res.message || "Login successful");

            set({ authUser: res.data });
        } catch (error) {
            console.error("Error logging in", error);
            toast.error("Error logging in");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    signup: async (data) => {
        set({ isSigninUp: true });

        try {
            const res = await axiosInstance.post("/auth/register", data);

            toast.success(res.message || "User created successfully");

            set({ authUser: res.data });
        } catch (error) {
            console.error("Error signing in", error);
            toast.error("Error signing in");
        } finally {
            set({ isSigninUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get("/auth/logout");
            set({ authUser: null });

            toast.success("Logout successful");
        } catch (error) {
            console.error("Error logging out", error);
            toast.error("Error logging out");
        }
    },

    verifyEmail: async (token) => {
        try {
            const res = await axiosInstance.get(`/auth/verify/${token}`);

            toast.success(res.message || "Email verified");

            return { status: "success" };
        } catch (error) {
            console.error("Error verifying email", error);
            toast.error("Error verifying email");
            return { status: "error" };
        }
    },

    forgotPassword: async (data) => {
        try {
            await axiosInstance.post("/auth/forgot-password", data);

            toast.success("Check your email for reset link");
        } catch (error) {
            console.error("Error in forgot password", error);
            toast.error("Error sending reset link");
        }
    },

    resetPassword: async (data, token) => {
        try {
            const res = await axiosInstance.post(
                `/auth/reset-password${token}`,
                data,
            );

            toast.success(res.message || "Password reset successful");

            return { status: true };
        } catch (error) {
            console.error("Error resetting password", error);
            toast.error("Error resetting password");

            return { status: false };
        }
    },

    changePassword: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/change-password", data);

            toast.success(res.message || "Password changed");
        } catch (error) {
            console.error("Error changing password", error);
            toast.error("Error changing password");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });

        try {
            const res = await axiosInstance.patch("/auth/update-profile", data);

            toast.success(res.message || "Profile updated");

            return true;
        } catch (error) {
            console.error("Error updating profile", error);
            toast.error("Error updating profile");

            return false;
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    deleteUser: async (password) => {
        set({ isDeletingUser: true });

        try {
            await axiosInstance.delete("/auth/delete-user", {
                data: { password },
            });

            toast.success("User deleted");

            return true;
        } catch (error) {
            console.error("Error deleting user", error);
            toast.error("Error deleting user");

            return false;
        } finally {
            set({ isDeletingUser: false });
        }
    },
}));
