import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useCourseStore = create((set) => ({
    isCreatingCourse: false,
    createdCourse: null,

    createCourse: async (data) => {
        set({ isCreatingCourse: true });

        try {
            const res = await axiosInstance.post(
                "/course/instructor/create",
                data,
            );

            set({ createdCourse: res.data });

            toast.success(res.message || "Course created");
        } catch (error) {
            console.error("Error creating course", error);
            toast.error("Error creating course");
        } finally {
            set({ isCreatingCourse: false });
        }
    },
}));
