import React, { useEffect } from "react";
import { useLessonStore } from "@/stores/useLessonStore";
import { ArrowLeft, Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/stores/useQuizStore";
import { useModuleStore } from "@/stores/useModuleStore";

export const LessonsPage = () => {
    const { id } = useParams();

    const {
        getAllLessons,
        isGettingAllLessons,
        allLessons,
        markLessonComplete,
        isMarkingComplete,
    } = useLessonStore();

    const { isGettingQuizForModule, allQuizForModule, getAllQuizForModule } =
        useQuizStore();

    const { getModuleById, isGettingModule, moduleById } = useModuleStore();

    useEffect(() => {
        getAllLessons(id);
        getAllQuizForModule(id);
        getModuleById(id);
        //eslint-disable-next-line
    }, [id]);

    let serialNo = 1;

    if (isGettingAllLessons || isGettingQuizForModule || isGettingModule) {
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
                    <div className="flex flex-col gap-2 md:gap-0">
                        <h1 className="text-2xl md:text-3xl font-bold underline underline-offset-2">
                            {allLessons?.data?.module?.courseTitle}
                        </h1>
                        <h3 className="text-sm md:text-xl">
                            {allLessons?.data?.module?.title}
                        </h3>
                    </div>
                </div>
                <div className="flex justify-between items-center px-8">
                    <p className="text-xs md:text-base">
                        <span className="font-semibold">Total Lessons: </span>{" "}
                        {allLessons?.data?.totalLessons}
                    </p>
                    <p className="text-xs md:text-base">
                        <span className="font-semibold">Total Quizzes: </span>{" "}
                        {allQuizForModule?.data?.totalQuizzes}
                    </p>
                </div>
            </div>

            <div className="h-full w-full flex-1 flex flex-col border border-dashed border-pink-200 dark:border-pink-950 my-2 rounded-2xl overflow-y-auto no-scroll">
                {allLessons?.data?.lessons?.map((lesson) => {
                    return (
                        <div
                            key={lesson.id}
                            className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center px-5 m-2 border-2 rounded-xl border-l-8 border-pink-400 py-2"
                        >
                            <div className="flex flex-col">
                                <h6 className="text-xl font-semibold">
                                    <span className="font-normal text-sm">
                                        {serialNo++}.
                                    </span>{" "}
                                    {lesson.title}
                                </h6>
                                <p>
                                    <span className="font-semibold">
                                        Type:{" "}
                                    </span>{" "}
                                    {lesson.contentType}
                                </p>
                                {lesson.contentUrl ? (
                                    <Link
                                        to={`${lesson.contentUrl}`}
                                        target="_blank"
                                        className="hover:underline hover:underline-offset-2 text-blue-600 hover:text-blue-700 visited:text-purple-600"
                                    >
                                        View Content
                                    </Link>
                                ) : (
                                    <p className="text-xs italic cursor-not-allowed">
                                        URL Not provided
                                    </p>
                                )}
                            </div>
                            {!moduleById?.data?.lessons?.filter(
                                (les) => les.id === lesson.id,
                            )[0]?.progress[0]?.completed ? (
                                <Button
                                    variant="success"
                                    onClick={() =>
                                        markLessonComplete(lesson.id)
                                    }
                                    disabled={isMarkingComplete}
                                >
                                    {isMarkingComplete
                                        ? "Please wait..."
                                        : "Mark Completed"}
                                </Button>
                            ) : (
                                <Button variant="default" disabled={true}>
                                    Completed
                                </Button>
                            )}
                        </div>
                    );
                })}
                {allQuizForModule?.data?.quizzes?.map((quiz) => {
                    return (
                        <div
                            key={quiz.id}
                            className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center px-5 m-2 border-2 rounded-xl border-l-8 border-pink-400 py-2"
                        >
                            <div className="flex flex-col">
                                <h6 className="text-xl font-semibold">
                                    <span className="font-normal text-sm">
                                        {serialNo++}.
                                    </span>{" "}
                                    {quiz.title}
                                </h6>
                                <p>
                                    <span className="font-semibold">
                                        Type:{" "}
                                    </span>{" "}
                                    Quiz
                                </p>
                                <p className="text-sm">
                                    <span>Attemps:</span> {quiz._count.attempts}
                                </p>
                            </div>
                            <div className="flex justify-center items-center gap-5">
                                <Button variant="success" asChild>
                                    <Link
                                        to={`/quiz/attempt/${quiz.id}`}
                                        target="_blank"
                                    >
                                        Attempt Quiz
                                    </Link>
                                </Button>
                                <Button variant="default" asChild>
                                    <Link to={`/quiz/myAttempts/${quiz.id}`}>
                                        View Attempts
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
