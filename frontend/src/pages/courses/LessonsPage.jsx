import React, { useEffect } from "react";
import { useLessonStore } from "@/stores/useLessonStore";
import { ArrowLeft, Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export const LessonsPage = () => {
    const { id } = useParams();

    const { getAllLessons, isGettingAllLessons, allLessons } = useLessonStore();

    useEffect(() => {
        getAllLessons(id);
    }, [id]);

    console.log("All lessons: ", allLessons?.data);

    if (isGettingAllLessons) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center gap-2">
                    <Link to={"/"}>
                        <ArrowLeft />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold underline underline-offset-2">
                            {allLessons?.data?.module?.courseTitle}
                        </h1>
                        <h3 className="text-xl">
                            {allLessons?.data?.module?.title}
                        </h3>
                    </div>
                </div>
                <p className="pl-8">
                    <span className="font-semibold">Total Lessons: </span>{" "}
                    {allLessons?.data?.totalLessons}
                </p>
            </div>

            <div className="h-full w-full flex-1 flex flex-col border-2 border-dashed">
                {allLessons?.data?.lessons?.map((lesson) => {
                    return (
                        <div className="flex flex-col">
                            <h6>{lesson.title}</h6>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
