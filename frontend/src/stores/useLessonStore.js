import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useLessonStore = create((set) => ({
    isGettingAllLessons: false,
    allLessons: [],

    getAllLessons: async (moduleId) => {
        set({ isGettingAllLessons: true });

        try {
            const res = await axiosInstance.get(`/lesson/getAll/${moduleId}`);

            set({ allLessons: res.data });

            toast.success(res.message || "Lessons fetched");
        } catch (error) {
            console.error("Error fetching all lessons", error);
            toast.error("Error getting lessons");
        } finally {
            set({ isGettingAllLessons: false });
        }
    },
}));
