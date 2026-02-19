import React, { useEffect, useMemo } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    HelpCircle,
    Loader,
    Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ReadMore } from "@/utils/ReadMore";
import { timeAgo } from "@/utils/timeAgo";
import { useModuleStore } from "@/stores/useModuleStore";
import { Button } from "@/components/ui/button";

export const CourseHomePage = () => {
    const { id } = useParams();

    const { getCourseById, isGettingCourse, fetchedCourse } = useCourseStore();

    const { isGettingAllModules, allModules, getAllModules } = useModuleStore();

    useEffect(() => {
        getCourseById(id);
        getAllModules(id);
        //eslint-disable-next-line
    }, [id]);

    //Optimized modules sorting
    const sortedModules = useMemo(() => {
        if (!allModules || allModules?.length === 0) return [];

        return [...allModules.data].sort((a, b) => a.order - b.order);
    }, [allModules]);

    if (isGettingCourse || isGettingAllModules) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    console.log("All modules: ", allModules?.data);

    return (
        <div className="h-full w-full flex flex-col">
            {/* NavBar */}
            <div>
                <div className="flex items-center gap-2">
                    <Link to={"/"} className="hidden md:block">
                        <ArrowLeft size={18} />
                    </Link>
                    <div className="h-full w-full flex flex-col justify-center items-start md:pl-2">
                        <h1 className="text-3xl font-bold hover:underline underline-offset-4 cursor-pointer hover:text-foreground/95">
                            {fetchedCourse?.data?.title}
                        </h1>
                        {fetchedCourse?.data?.description && (
                            <ReadMore text={fetchedCourse?.data?.description} />
                        )}
                    </div>
                </div>
                <div className="w-full flex justify-between items-center gap-1 md:px-8 py-2">
                    <div className="flex flex-col justify-between items-start">
                        <h5>
                            <span className="font-semibold">Author: </span>
                            {fetchedCourse?.data?.createdBy?.name}
                        </h5>
                        <p>
                            <span className="font-semibold">Added: </span>
                            {timeAgo(fetchedCourse?.data?.createdAt)}
                        </p>
                    </div>
                    <div className="flex gap-1 border-2 w-fit max-w-120 px-5 py-2 rounded-full bg-foreground/80 text-background">
                        {fetchedCourse?.data?.instructors && (
                            <ReadMore
                                text={`${fetchedCourse?.data?.instructors
                                    .map((ins) => ins.name)
                                    .join(", ")}`}
                                maxLen={50}
                                props={"text-sky-300 dark:text-sky-700 text-xs"}
                            />
                        )}
                    </div>
                </div>

                {/* Course Statistics */}
                <div className="flex flex-col md:px-8 py-2 border border-dotted rounded-xl shadow-2xl">
                    <h6 className="font-semibold pb-2">Course Stats</h6>
                    <div className="flex justify-between items-center cursor-default">
                        <p className="flex gap-2">
                            <span className="flex gap-2">
                                <BookOpen /> Modules:{" "}
                            </span>
                            {fetchedCourse?.data?._count?.modules}
                        </p>
                        <p className="flex gap-2">
                            <span className="flex gap-2">
                                <Users /> Enrollments:{" "}
                            </span>
                            {fetchedCourse?.data?._count?.enrollments}
                        </p>
                        <p className="flex gap-2">
                            <span className="flex gap-2">
                                <HelpCircle /> Quizzes:{" "}
                            </span>
                            {fetchedCourse?.data?._count?.quizzes}
                        </p>
                    </div>
                </div>
            </div>

            {/* Modules Section */}
            <div className="flex-1 h-full w-full border border-dashed border-pink-200 my-4 p-4 rounded-2xl flex flex-col gap-3 overflow-y-auto no-scroll">
                {sortedModules?.map((module) => {
                    return (
                        <div
                            key={module.id}
                            className="w-full p-2 border-2 rounded-xl flex justify-between items-center border-l-8 border-pink-400"
                        >
                            <div>
                                <h3 className="font-bold">
                                    <span>{module.order}. </span> {module.title}
                                </h3>
                                <p>
                                    <span className="font-semibold">
                                        Lessons:{" "}
                                    </span>{" "}
                                    {module._count.lessons}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Quiz:{" "}
                                    </span>{" "}
                                    {module._count.quiz}
                                </p>
                            </div>
                            <Button variant="icon" asChild>
                                <Link to={`/module/get/${module.id}`}>
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
