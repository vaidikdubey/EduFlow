import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useCourseStore = create((set) => ({
    isCreatingCourse: false,
    createdCourse: null,
    isGettingInstructors: false,
    allInstructors: null,
    isUpdatingCourse: false,
    updatedCourse: null,
    isGettingCourse: false,
    fetchedCourse: null,
    isGettingAllCourses: false,
    allCourses: [],
    isCheckingEnrollment: false,
    enrollment: null,
    enrollmentStatus: false,
    isGettingProgres: false,
    courseProgress: null,

    createCourse: async (data) => {
        set({ isCreatingCourse: true });

        try {
            const res = await axiosInstance.post(
                "/course/instructor/create",
                data,
            );

            set({ createdCourse: res.data });

            toast.success(res.message || "Course created");

            return true;
        } catch (error) {
            console.error("Error creating course", error);
            toast.error("Error creating course");

            return false;
        } finally {
            set({ isCreatingCourse: false });
        }
    },

    getAllInstructors: async () => {
        set({ isGettingInstructors: true });

        try {
            const res = await axiosInstance.get(
                "/course/instructor/getAllInstructors",
            );

            set({ allInstructors: res.data });
        } catch (error) {
            console.error("Error getting all instructors", error);
            toast.error("Error getting all instructors");
        } finally {
            set({ isGettingInstructors: false });
        }
    },

    updateCourse: async (data, id) => {
        set({ isUpdatingCourse: true });

        try {
            const res = await axiosInstance.patch(
                `/course/instructor/update/${id}`,
                data,
            );

            set({ updatedCourse: res.data });

            toast.success(res.message || "Course updated");
        } catch (error) {
            console.error("Error updating course", error);
            toast.error("Error updating course");
        } finally {
            set({ isUpdatingCourse: false });
        }
    },

    getCourseById: async (id) => {
        set({ isGettingCourse: true });

        try {
            const res = await axiosInstance.get(`/course/getCourse/${id}`);

            set({ fetchedCourse: res.data });

            toast.success(res.message || "Course fetched");
        } catch (error) {
            console.error("Error fetching course by id", error);
            toast.error("Error fetching course");
        } finally {
            set({ isGettingCourse: false });
        }
    },

    getAllCourses: async () => {
        set({ isGettingAllCourses: true });

        try {
            const res = await axiosInstance.get("/course/getPublished");

            set({ allCourses: res.data });

            toast.success(res.data.message || "Courses fetched");
        } catch (error) {
            console.error("Error fetching courses", error);
            toast.error("Error fetching courses");
        } finally {
            set({ isGettingAllCourses: false });
        }
    },

    checkEnrollment: async (id) => {
        set({ isCheckingEnrollment: true });

        try {
            const res = await axiosInstance.get(`/course/enrolled/${+id}`);

            set({ enrollment: res.data });

            set({ enrollmentStatus: res.data.data.status });

            return res.data.data.status;
        } catch (error) {
            console.error("Error checking enrollment", error);
            toast.error("Error checking enrollment");

            return null;
        } finally {
            set({ isCheckingEnrollment: false });
        }
    },

    getCourseProgress: async (id) => {
        set({ isGettingProgres: true });

        try {
            const res = await axiosInstance.get(`/course/progress/${id}`);

            set({ courseProgress: res.data });
        } catch (error) {
            console.error("Error fetching progress", error);
            toast.error("Error fetching progress");
        } finally {
            set({ isGettingProgres: false });
        }
    },
}));
