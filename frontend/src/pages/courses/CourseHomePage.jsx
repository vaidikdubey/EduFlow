import React, { useEffect } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

export const CourseHomePage = () => {
    const { id } = useParams();

    const { getCourseById, isGettingCourse, fetchedCourse } = useCourseStore();

    useEffect(() => {
        getCourseById(id);
    }, [id]);

    if (isGettingCourse) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return <div>CourseHomePage</div>;
};
