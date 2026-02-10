import { useCourseStore } from "@/stores/useCourseStore";
import React, { useEffect } from "react";

export const AllCoursesPage = () => {
    const { isGettingAllCourses, allCourses, getAllCourses } = useCourseStore();

    useEffect(() => {
        getAllCourses();
    }, []);

    useEffect(() => {
        if (allCourses) console.log("All courses: ", allCourses);
    }, [allCourses]);

    return <div>AllCoursesPage</div>;
};
