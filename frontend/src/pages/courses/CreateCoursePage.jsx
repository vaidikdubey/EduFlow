import { useCourseStore } from "@/stores/useCourseStore";
import React, { useEffect, useState } from "react";

export const CreateCoursePage = () => {
    const { isCreatingCourse, createdCourse, createCourse } = useCourseStore();
};
