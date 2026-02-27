import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useModuleStore = create((set) => ({
    isGettingAllModules: false,
    allModules: [],
    isGettingModule: false,
    moduleById: null,

    getAllModules: async (id) => {
        set({ isGettingAllModules: true });

        try {
            const res = await axiosInstance.get(`/module/getAll/${id}`);

            set({ allModules: res.data });
        } catch (error) {
            console.error("Error getting modules", error);
            toast.error(error.response.data.message || "Error getting modules");
        } finally {
            set({ isGettingAllModules: false });
        }
    },

    getModuleById: async (id) => {
        set({ isGettingModule: true });

        try {
            const res = await axiosInstance.get(`/module/getModule/${id}`);

            set({ moduleById: res.data });

            toast.success(res.message || "Module found");
        } catch (error) {
            console.error("Error getting module by id", error);
            toast.error(error.response.data.message || "Error getting module");
        } finally {
            set({ isGettingModule: false });
        }
    },
}));
