import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useEnrollmentStore = create((set) => ({
    isEnrolling: false,
    enrollmentResult: null,

    enrollInCourse: async (id) => {
        set({ isEnrolling: true });

        try {
            const res = await axiosInstance.post(`/enrollment/enroll/${id}`);

            set({ enrollmentResult: res.data });

            toast.success(res.message || "Enrollment successful");
        } catch (error) {
            console.error("Enrollment failed", error);
            toast.error("Enrollment failed");
        } finally {
            set({ isEnrolling: false });
        }
    },
}));
