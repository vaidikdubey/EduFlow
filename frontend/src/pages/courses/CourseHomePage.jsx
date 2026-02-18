import React, { useEffect } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { ArrowLeft, Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";

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
            <Link to={"/"}>
                <ArrowLeft className="absolute top-1 left-0" size={18} />
            </Link>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold hover:underline underline-offset-4 cursor-pointer hover:text-foreground/95">
                    {fetchedCourse?.data?.title}
                </h1>
                <p className="text-lg ">{fetchedCourse?.data?.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam facere corporis adipisci sunt obcaecati doloremque in corrupti quibusdam vero doloribus beatae animi omnis, distinctio odit at est provident iusto. Voluptates nulla at soluta modi, minus officia? Voluptate tempore natus laborum eveniet fugiat commodi asperiores eaque, pariatur, officia inventore doloremque quae!</p>
            </div>
        </div>
    );
};
