import React, { useEffect, useState, useRef } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { loadRazorpayScript } from "@/utils/loadRazorpay";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosInstance } from "@/lib/axios";

export const EnrollPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { checkEnrollment } = useCourseStore();
    const { authUser } = useAuthStore();
    const [status, setStatus] = useState("checking"); // checking | processing | failed

    // We use a ref to prevent double-firing
    const paymentInitiated = useRef(false);

    useEffect(() => {
        const handleEnrollmentFlow = async () => {
            if (paymentInitiated.current) return;
            paymentInitiated.current = true;

            setStatus("checking");
            const isEnrolled = await checkEnrollment(id);

            if (isEnrolled) {
                navigate(`/course/get/${id}`);
                return;
            }

            // If not enrolled, immediately start payment
            await triggerPayment();
        };

        handleEnrollmentFlow();
    }, [id]);

    const triggerPayment = async () => {
        setStatus("processing");
        try {
            // 1. Load Script
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                toast.error("Error loading script");
                console.error("Razorpay SDK failed to load");
            }

            // 2. Create Order
            // Note: Replace with your actual API instance/URL
            const { data: response } = await axiosInstance.post(
                `http://localhost:5000/api/v1/enroll/${id}`,
                {},
                { withCredentials: true },
            );

            // Handle Free Course (Backend returns success immediately)
            if (!response.data.razorpay_details) {
                toast.success("Enrolled Successfully!");
                navigate(`/course/get/${id}`);
                return;
            }

            // Handle Paid Course
            const { razorpay_details } = response.data;

            const options = {
                key: razorpay_details.key,
                amount: razorpay_details.amount,
                currency: razorpay_details.currency,
                name: "Course Enrollment",
                description: razorpay_details.courseTitle,
                order_id: razorpay_details.orderId,
                handler: function (response) {
                    toast.success("Payment Successful!");
                    // Ideally verify payment on backend here, then redirect
                    navigate(`/course/get/${id}`);
                },
                prefill: {
                    name: authUser?.name || "",
                    email: authUser?.email || "",
                },
                theme: { color: "#ec4899" }, // Matches your pink loader
                modal: {
                    // Handle if user closes the modal
                    ondismiss: function () {
                        setStatus("failed");
                        toast.error("Payment cancelled");
                        // Optional: Navigate back or show a "Retry" button
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response) {
                toast.error(response.error.description);
                setStatus("failed");
            });

            rzp.open();
        } catch (error) {
            console.error("Payment Error:", error);
            setStatus("failed");
            toast.error("Failed to initiate payment");
        }
    };

    if (status === "checking" || status === "processing") {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <Loader className="animate-spin text-pink-500 w-10 h-10" />
                <p className="text-gray-500 font-medium">
                    {status === "checking"
                        ? "Checking enrollment..."
                        : "Opening payment gateway..."}
                </p>
            </div>
        );
    }

    // Fallback UI if auto-open fails or user cancels
    return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-bold">Enrollment Required</h2>
            <p className="text-gray-500">
                Please complete payment to access this course.
            </p>
            <button
                onClick={() => {
                    paymentInitiated.current = false;
                    triggerPayment();
                }}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
                Pay Now
            </button>
        </div>
    );
};
