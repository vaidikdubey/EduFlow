import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { loadRazorpayScript } from "@/utils/loadRazorpay";

export const useEnrollmentStore = create((set, get) => ({
    isEnrolling: false,
    enrollmentResult: null,

    enrollInCourse: async (courseId, navigate) => {
        try {
            // 1. Load Razorpay SDK
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                toast.error("Razorpay SDK failed to load");
                return;
            }

            // 2. Request Enrollment/Order from Backend
            const response = await axiosInstance.post(
                `/enrollment/enroll/${courseId}`,
                {},
            );

            // SCENARIO A: Free Course
            if (!response.data.razorpay_details) {
                toast.success("Enrolled successfully!");
                navigate(`/course/get/${courseId}`);
                return;
            }

            // SCENARIO B: Paid Course
            const { razorpay_details } = response.data;
            const { user } = get(); // Get user info from your own store state

            const options = {
                key: razorpay_details.key,
                amount: razorpay_details.amount,
                currency: razorpay_details.currency,
                name: "LMS Platform",
                description: razorpay_details.courseTitle,
                order_id: razorpay_details.orderId,
                handler: async (paymentResponse) => {
                    toast.success("Payment successful!");
                    // Small delay to let webhook process
                    setTimeout(() => navigate(`/course/get/${courseId}`), 1000);
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: { color: "#ec4899" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            const message =
                error.response?.data?.message || "Enrollment failed";
            toast.error(message);
            throw error; // Re-throw so component can handle UI state
        }
    },

    // enrollInCourse: async (id) => {
    //     set({ isEnrolling: true });

    //     try {
    //         const res = await axiosInstance.post(`/enrollment/enroll/${id}`);

    //         set({ enrollmentResult: res.data });

    //         toast.success(res.message || "Enrollment successful");
    //     } catch (error) {
    //         console.error("Enrollment failed", error);
    //         toast.error("Enrollment failed");
    //     } finally {
    //         set({ isEnrolling: false });
    //     }
    // },
}));
