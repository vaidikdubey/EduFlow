import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useQuizStore = create((set) => ({
    isGettingQuizForModule: false,
    allQuizForModule: [],
    isGettingQuiz: false,
    quizById: null,

    getAllQuizForModule: async (id) => {
        set({ isGettingQuizForModule: true });

        try {
            const res = await axiosInstance.get(`/quiz/quizByModule/${id}`);

            set({ allQuizForModule: res.data });
        } catch (error) {
            console.error("Error fetching quizzes", error);
            toast.error(
                error.response.data.message || "Error fetching quizzes",
            );
        } finally {
            set({ isGettingQuizForModule: false });
        }
    },

    getQuizById: async (id) => {
        set({ isGettingQuiz: true });

        try {
            const res = await axiosInstance.get(`/quiz/getQuiz/${id}`);

            set({ quizById: res.data });

            toast.success(res.message || "Quiz fetched");
        } catch (error) {
            console.error("Error fetching quiz", error);
            toast.error(error.response.data.message || "Error fetching quiz");
        } finally {
            set({ isGettingQuiz: false });
        }
    },
}));
