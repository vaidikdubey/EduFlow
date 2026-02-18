import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { loadRazorpayScript } from "@/utils/loadRazorpay";
import { useAuthStore } from "./useAuthStore";

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
            const user = useAuthStore.getState().authUser.data;

            const options = {
                key: razorpay_details.key,
                amount: razorpay_details.amount,
                currency: razorpay_details.currency,
                name: "EduFlow Course",
                description: razorpay_details.courseTitle,
                order_id: razorpay_details.orderId,
                handler: async (paymentResponse) => {
                    toast.success("Payment successful!");
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
            console.error("Error processing payment", error);
            toast.error("Error processing payment");
        }
    },
}));
