import React, { useEffect } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { ArrowLeft, Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ReadMore } from "@/utils/ReadMore";
import { timeAgo } from "@/utils/timeAgo";

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
            {/* NavBar */}
            <div className="flex items-center gap-2">
                <Link to={"/"} className="hidden md:block">
                    <ArrowLeft size={18} />
                </Link>
                <div className="h-full w-full flex flex-col justify-center items-start pl-2">
                    <h1 className="text-3xl font-bold hover:underline underline-offset-4 cursor-pointer hover:text-foreground/95">
                        {fetchedCourse?.data?.title}
                    </h1>
                    {fetchedCourse?.data?.description && (
                        <ReadMore text={fetchedCourse?.data?.description} />
                    )}
                </div>
            </div>
            <div className="w-full flex flex-col gap-1 px-8 py-2">
                <div className="flex justify-between items-center">
                    <h5>
                        <span className="font-semibold">Author: </span>
                        {fetchedCourse?.data?.createdBy?.name}
                    </h5>
                    <p>
                        <span className="font-semibold">Added: </span>
                        {timeAgo(fetchedCourse?.data?.createdAt)}
                    </p>
                </div>
                <p>
                    <span className="font-semibold">Instructors: </span>{" "}
                    {fetchedCourse?.data?.instructors
                        .map((ins) => ins.name)
                        .join(", ")}
                </p>
            </div>

            {/* Course Statistics */}
            <div className="flex flex-col px-8 py-2 border border-dotted rounded-xl">
                <h6 className="font-semibold mx-auto pb-2 underline underline-offset-2">Course Stats</h6>
                <div className="flex justify-between items-center">
                    <p>
                        <span>Modules: </span>
                        {fetchedCourse?.data?._count?.modules}
                    </p>
                    <p>
                        <span>Enrollments: </span>
                        {fetchedCourse?.data?._count?.enrollments}
                    </p>
                    <p>
                        <span>Quizzes: </span>
                        {fetchedCourse?.data?._count?.quizzes}
                    </p>
                </div>
            </div>
        </div>
    );
};
