import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCourseStore } from "@/stores/useCourseStore";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

export const EnrollmentButton = ({ courseId }) => {
    const { checkEnrollment } = useCourseStore();

    const [isEnrolled, setIsEnrolled] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyStatus = async () => {
            setLoading(true);

            const status = await checkEnrollment(courseId);

            setIsEnrolled(status);

            setLoading(false);
        };

        if (courseId) {
            verifyStatus();
        }
    }, [courseId, checkEnrollment]);

    const handleEnrollment = () => {
        
    }

    if (loading) {
        return (
            <Button disabled className={cn("w-full")}>
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Checking...
            </Button>
        );
    }

    return isEnrolled ? (
        <Button
            asChild
            variant="outline"
            className={cn("w-full cursor-pointer")}
        >
            <Link to={`/course/get/${courseId}`}>View Course</Link>
        </Button>
    ) : (
            <Button
                asChild
                className={cn("w-full cursor-pointer")}
                onClick={handleEnrollment}
            >
            Enroll
        </Button>
    );
};
