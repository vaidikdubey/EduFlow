import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useLessonStore = create((set) => ({
    isGettingAllLessons: false,
    allLessons: [],
    isMarkingComplete: false,
    isCreatingLesson: false,
    createdLesson: null,

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

    markLessonComplete: async (id) => {
        set({ isMarkingComplete: true });

        try {
            await axiosInstance.patch(`/lesson/markCompleted/${id}`, {
                completed: true,
            });

            toast.success("Lesson completed");
        } catch (error) {
            console.error("Error marking lesson completed", error);
            toast.error(
                error.response.data.message || "Error marking lesson completed",
            );
        } finally {
            set({ isMarkingComplete: false });
        }
    },

    createLesson: async (id, response) => {
        set({ isCreatingLesson: true });

        try {
            const res = await axiosInstance.post(
                `/lesson/create/${id}`,
                response,
            );

            set({ createdLesson: res.data });

            toast.success(res.message || "Lesson created");

            return true;
        } catch (error) {
            console.error("Error creating lesson", error);
            toast.error(error.response.data.message || "Error creating lesson");

            return false;
        } finally {
            set({ isCreatingLesson: false });
        }
    },
}));
