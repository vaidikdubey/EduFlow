import React, { useEffect } from "react";
import { useLessonStore } from "@/stores/useLessonStore";
import { ArrowLeft, Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const LessonsPage = () => {
    const { id } = useParams();

    const {
        getAllLessons,
        isGettingAllLessons,
        allLessons,
        markLessonComplete,
        isMarkingComplete,
    } = useLessonStore();

    useEffect(() => {
        getAllLessons(id);
        //eslint-disable-next-line
    }, [id]);

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

            <div className="h-full w-full flex-1 flex flex-col border border-dashed border-pink-200 dark:border-pink-950 my-2 rounded-2xl">
                {allLessons?.data?.lessons?.map((lesson, idx) => {
                    return (
                        <div
                            key={lesson.id}
                            className="flex justify-between items-center px-5 m-2 border-2 rounded-xl border-l-8 border-pink-400 py-2"
                        >
                            <div className="flex flex-col">
                                <h6 className="text-xl font-semibold">
                                    <span className="font-normal text-sm">
                                        {idx + 1}.
                                    </span>{" "}
                                    {lesson.title}
                                </h6>
                                <p>
                                    <span className="font-semibold">
                                        Type:{" "}
                                    </span>{" "}
                                    {lesson.contentType}
                                </p>
                                {lesson.contentType != "TEXT" &&
                                    lesson.contentUrl && (
                                        <Link
                                            to={`${lesson.contentUrl}`}
                                            target="_blank"
                                            className="hover:underline hover:underline-offset-2 text-blue-600 hover:text-blue-700 visited:text-purple-600"
                                        >
                                            View Content
                                        </Link>
                                    )}
                            </div>
                            <Button
                                variant="success"
                                onClick={() => markLessonComplete(lesson.id)}
                                disabled={isMarkingComplete}
                            >
                                {isMarkingComplete
                                    ? "Please wait..."
                                    : "Mark Completed"}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
