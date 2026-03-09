import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useQuizStore = create((set) => ({
    isGettingQuizForModule: false,
    allQuizForModule: [],
    isGettingQuiz: false,
    quizById: null,
    isSubmittingQuiz: false,
    submittedQuiz: null,
    isGettingQuizAttempt: false,
    quizAttempts: [],
    isCreatingQuiz: false,
    createdQuiz: null,
    isUpdatingQuiz: false,
    updatedQuiz: null,

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

    submitQuiz: async (id, data) => {
        set({ isSubmittingQuiz: true });

        try {
            const res = await axiosInstance.post(`/quiz/submit/${id}`, data);

            set({ submittedQuiz: res.data });

            toast.success(res.message || "Quiz submitted");

            return true;
        } catch (error) {
            console.error("Error submitting quiz", error);
            toast.error(error.response.data.message || "Error submitting quiz");

            return false;
        } finally {
            set({ isSubmittingQuiz: false });
        }
    },

    getQuizAttempt: async (id) => {
        set({ isGettingQuizAttempt: true });

        try {
            const res = await axiosInstance.get(`/quiz/getQuizAttempt/${id}`);

            set({ quizAttempts: res.data });

            toast.success(res.message || "Quiz attempt fetched");
        } catch (error) {
            console.error("Error fetching quiz attempt", error);
            toast.error(
                error.response.data.message || "Error fetching quiz attempt",
            );
        } finally {
            set({ isGettingQuizAttempt: false });
        }
    },

    createQuiz: async (data, moduleId) => {
        set({ isCreatingQuiz: true });

        try {
            const res = await axiosInstance.post(
                `/quiz/create/${moduleId}`,
                data,
            );

            set({ createdQuiz: res.data });

            toast.success(res.message || "Quiz created");

            return true;
        } catch (error) {
            console.error("Error creating quiz", error);
            toast.error(error.response.data.message || "Error creating quiz");

            return false;
        } finally {
            set({ isCreatingQuiz: false });
        }
    },

    updateQuiz: async (data, id) => {
        set({ isUpdatingQuiz: true });

        try {
            const res = await axiosInstance.patch(`/quiz/update/${id}`, data);

            set({ updatedQuiz: res.data });

            toast.success(res.message || "Quiz updated");

            return true;
        } catch (error) {
            console.error("Error updating quiz", error);
            toast.error(error.response.data.message || "Error updating quiz");
        } finally {
            set({ isUpdatingQuiz: false });
        }
    },
}));
