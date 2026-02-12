import React, { useEffect } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { Loader,  } from "lucide-react";

export const AllCoursesPage = () => {
    const { isGettingAllCourses, allCourses, getAllCourses } = useCourseStore();

    useEffect(() => {
        getAllCourses();
    }, []);

    console.log("All courses: ", allCourses);

    if (isGettingAllCourses) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <h1>All courses </h1>
        </div>
    );
};
