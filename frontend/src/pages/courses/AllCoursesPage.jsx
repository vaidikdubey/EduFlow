import { useCourseStore } from "@/stores/useCourseStore";
import React, { useEffect } from "react";

export const AllCoursesPage = () => {
    const { isGettingAllCourses, allCourses, getAllCourses } = useCourseStore();

    useEffect(() => {
        getAllCourses();
    }, []);

    return <div>AllCoursesPage</div>;
};
