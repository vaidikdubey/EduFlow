import React, { useEffect, useState, useRef } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useEnrollmentStore } from "@/stores/useEnrollmentStore";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";

export const EnrollPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { checkEnrollment } = useCourseStore();
    const [status, setStatus] = useState("checking"); // checking | processing | failed
    const { createOrder, isVerifyingPayment, isCreatingOrder, verifyPayment } =
        useEnrollmentStore();
    const { authUser } = useAuthStore();

    const enrollmentRetry = async () => {
        if (isCreatingOrder || isVerifyingPayment) return;

        try {
            const order = await createOrder(id);

            if (order?.data?.type?.toUpperCase() === "FREE") {
                setTimeout(navigate(`/course/get/${id}`, { replace: true }), 0);
                return;
            } else {
                const options = {
                    key: order.data.razorpay_details.key,
                    amount: order.data.razorpay_details.amount,
                    currency: order.data.razorpay_details.currency,
                    name: order.data.razorpay_details.courseTitle,
                    description:
                        "Unlock full access to this premium course, including all lessons, resources, and future updates.",
                    order_id: order.data.razorpay_details.orderId,
                    prefill: {
                        name: authUser?.data?.name || "User",
                        email: authUser?.data?.email || "",
                    },
                    theme: {
                        color: "#EC4899",
                    },
                    handler: async (response) => {
                        await verifyPayment(response);
                        setTimeout(
                            () =>
                                navigate(`/course/get/${id}`, {
                                    replace: true,
                                }),
                            0,
                        );
                    },
                    modal: {
                        ondismiss: () => {
                            toast("Payment cancelled", { icon: "❌" });
                        },
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (error) {
            console.error("Enroll in course error", error);
        }
    };

    useEffect(() => {
        const handleEnrollment = async () => {
            setStatus("checking");
            const isEnrolled = await checkEnrollment(id);

            if (isEnrolled) {
                setTimeout(navigate(`/course/get/${id}`, { replace: true }), 0);
                return;
            }

            if (isCreatingOrder || isVerifyingPayment) return;

            try {
                const order = await createOrder(id);

                console.log(order?.data?.type);

                if (order?.data?.type?.toUpperCase() === "FREE") {
                    setTimeout(
                        navigate(`/course/get/${id}`, { replace: true }),
                        0,
                    );
                    return;
                } else {
                    const options = {
                        key: order.data.razorpay_details.key,
                        amount: order.data.razorpay_details.amount,
                        currency: order.data.razorpay_details.currency,
                        name: order.data.razorpay_details.courseTitle,
                        description:
                            "Unlock full access to this premium course, including all lessons, resources, and future updates.",
                        order_id: order.data.razorpay_details.orderId,
                        prefill: {
                            name: authUser?.data?.name || "User",
                            email: authUser?.data?.email || "",
                        },
                        theme: {
                            color: "#EC4899",
                        },
                        handler: async (response) => {
                            await verifyPayment(response);
                            setTimeout(
                                () =>
                                    navigate(`/course/get/${id}`, {
                                        replace: true,
                                    }),
                                0,
                            );
                        },
                        modal: {
                            ondismiss: () => {
                                toast("Payment cancelled", { icon: "❌" });
                            },
                        },
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.open();
                }
            } catch (error) {
                console.error("Enroll in course error", error);
            }
        };

        handleEnrollment();
        //eslint-disable-next-line
    }, [id]);

    if (isCreatingOrder || isVerifyingPayment || status === "checking") {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <Loader className="animate-spin text-pink-500 w-10 h-10" />
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
                onClick={enrollmentRetry}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
                Enroll Now
            </button>
        </div>
    );
};
