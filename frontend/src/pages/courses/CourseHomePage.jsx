import React, { useEffect } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import { ReadMore } from "@/utils/ReadMore";

export const CourseHomePage = () => {
    const { id } = useParams();

    const { getCourseById, isGettingCourse, fetchedCourse } = useCourseStore();

    useEffect(() => {
        getCourseById(id);
    }, [id]);

    console.log("Fetched course: ", fetchedCourse?.data);

    if (isGettingCourse) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold hover:underline underline-offset-4 cursor-pointer hover:text-foreground/95">
                    {fetchedCourse?.data?.title}
                </h1>
                <ReadMore text={fetchedCourse?.data?.description} />
            </div>
        </div>
    );
};
