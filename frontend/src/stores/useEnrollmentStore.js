import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { loadRazorpayScript } from "@/utils/loadRazorpay";
import { useAuthStore } from "./useAuthStore";

export const useEnrollmentStore = create((set) => ({
    isEnrolling: false,
    enrollmentResult: null,
    isMarkingCompleted: false,
    isCancellingEnrollment: false,
    isCheckingCompletion: false,
    courseCompletion: null,
    isGeneratingCertificate: false,
    isGettingMyEnrollments: false,
    myEnrollments: [],
    isCreatingOrder: false,
    paymentData: null,
    isVerifyingPayment: false,
    verifyPaymentData: null,
    isPaymentLoading: false,

    // enrollInCourse: async (courseId, navigate) => {
    //     set({ isEnrolling: true });

    //     try {
    //         // 1. Load Razorpay SDK
    //         const isScriptLoaded = await loadRazorpayScript();
    //         if (!isScriptLoaded) {
    //             toast.error("Razorpay SDK failed to load");
    //             return;
    //         }

    //         // 2. Request Enrollment/Order from Backend
    //         const response = await axiosInstance.post(
    //             `/enrollment/enroll/${courseId}`,
    //             {},
    //         );

    //         // SCENARIO A: Free Course
    //         if (!response.data.data.razorpay_details) {
    //             toast.success("Enrolled successfully!");
    //             navigate(`/course/get/${courseId}`, { replace: true });
    //             return;
    //         }

    //         // SCENARIO B: Paid Course
    //         const { razorpay_details } = response.data.data;
    //         const user = useAuthStore.getState().authUser.data;

    //         const options = {
    //             key: razorpay_details.key,
    //             amount: razorpay_details.amount,
    //             currency: razorpay_details.currency,
    //             name: `EduFlow Course - ${razorpay_details.courseTitle}`,
    //             description: razorpay_details.courseTitle,
    //             order_id: razorpay_details.orderId,
    //             prefill: {
    //                 name: user?.name || "",
    //                 email: user?.email || "",
    //             },
    //             theme: { color: "#EC4899" },
    //             handler: async (paymentResponse) => {
    //                 try {
    //                     await axiosInstance.post(
    //                         "/enrollment/enroll/verify",
    //                         paymentResponse,
    //                     );
    //                     setTimeout(
    //                         () =>
    //                             navigate(`/course/get/${courseId}`, {
    //                                 replace: true,
    //                             }),
    //                         1000,
    //                     );
    //                 } catch (error) {
    //                     console.error("Error verifying payment", error);
    //                     toast.error(
    //                         error.response.data.message ||
    //                             "Error verifying payment",
    //                     );
    //                 }
    //             },
    //             modal: {
    //                 ondismiss: () => {
    //                     toast("Payment cancelled", { icon: "❌" });
    //                     navigate("/course", { replace: true });
    //                 },
    //             },
    //         };

    //         const rzp = new window.Razorpay(options);
    //         rzp.open();
    //     } catch (error) {
    //         console.error("Error processing payment", error);
    //         toast.error(
    //             error.response.data.message || "Error processing payment",
    //         );
    //     } finally {
    //         set({ isEnrolling: false });
    //     }
    // },

    createOrder: async (courseId) => {
        set({ isPaymentLoading: true });

        try {
            const res = await axiosInstance.post(
                `/enrollment/enroll/${courseId}`,
                {},
            );

            set({ paymentData: res.data });

            return res.data;
        } catch (error) {
            console.error("Error creating order", error);
            toast.error(error.response.data.message || "Error creating order");
        } finally {
            set({ isPaymentLoading: false });
        }
    },

    verifyPayment: async (response) => {
        set({ isVerifyingPayment: true });

        try {
            const res = await axiosInstance.post(
                `/enrollment/enroll/verify`,
                response,
            );

            set({ verifyPaymentData: res.data });
            toast.success(res.message || "Payment verified🎉");
        } catch (error) {
            console.error("Error verifying payment", error);
            toast.error(
                error.response.data.message || "Error verifying payment",
            );
        } finally {
            set({ isVerifyingPayment: false });
        }
    },

    markCourseCompleted: async (id) => {
        set({ isMarkingCompleted: true });

        try {
            await axiosInstance.patch(`/enrollment/completed/${id}`, {
                completed: true,
            });

            toast.success("Course completed");
        } catch (error) {
            console.error("Error marking course completed", error);
            toast.error(
                error.response.data.message || "Error marking course completed",
            );
        } finally {
            set({ isMarkingCompleted: false });
        }
    },

    cancelEnrollment: async (id) => {
        set({ isCancellingEnrollment: true });

        try {
            await axiosInstance.delete(`/enrollment/cancel/${id}`);

            toast.success("Enrollment cancelled");
        } catch (error) {
            console.error("Error cancelling enrollment", error);
            toast.error(
                error.response.data.message || "Error cancelling enrollment",
            );
        } finally {
            set({ isCancellingEnrollment: false });
        }
    },

    checkCourseCompletion: async (id) => {
        set({ isCheckingCompletion: true });

        try {
            const res = await axiosInstance.get(
                `/enrollment/courseStatus/${id}`,
            );

            set({ courseCompletion: res.data });
        } catch (error) {
            console.error("Error fetching course completion status", error);
            toast.error(
                error.response.data.message ||
                    "Error fetching course completion status",
            );
        } finally {
            set({ isCheckingCompletion: false });
        }
    },

    generateCertificate: async () => {},

    getMyEnrollments: async () => {
        set({ isGettingMyEnrollments: true });

        try {
            const res = await axiosInstance.get(`/enrollment/myEnrollments`);

            set({ myEnrollments: res.data });
        } catch (error) {
            console.error("Error fetching enrollments", error);
            toast.error(
                error.response.data.message || "Error fetching enrollments",
            );
        } finally {
            set({ isGettingMyEnrollments: false });
        }
    },
}));
