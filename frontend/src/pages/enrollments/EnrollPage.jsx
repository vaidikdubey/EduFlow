import React, { useEffect, useState, useRef } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useEnrollmentStore } from "@/stores/useEnrollmentStore";

export const EnrollPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { checkEnrollment } = useCourseStore();
    const [status, setStatus] = useState("checking"); // checking | processing | failed
    const { enrollInCourse } = useEnrollmentStore();

    // We use a ref to prevent double-firing
    const paymentInitiated = useRef(false);

    useEffect(() => {
        const handleEnrollmentFlow = async () => {
            if (paymentInitiated.current) return;
            paymentInitiated.current = true;

            setStatus("checking");
            const isEnrolled = await checkEnrollment(id);

            if (isEnrolled) {
                paymentInitiated.current = false;
                navigate(`/course/get/${id}`);
                return;
            }

            // If not enrolled, immediately start payment
            await enrollInCourse(id, navigate);
        };

        handleEnrollmentFlow();
    }, [id]);

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
                    enrollInCourse(id, navigate);
                }}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
                Enroll Now
            </button>
        </div>
    );
};
