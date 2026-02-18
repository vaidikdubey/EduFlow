import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useModuleStore = create((set) => ({
    isGettingAllModules: false,
    allModules: [],

    getAllModules: async (id) => {
        set({ isGettingAllModules: true });

        try {
            const res = await axiosInstance.get(`/module/getAll/${id}`);

            set({ allModules: res.data });
        } catch (error) {
            console.error("Error getting modules", error);
            toast.error("Error getting modules");
        } finally {
            set({ isGettingAllModules: false });
        }
    },
}));
