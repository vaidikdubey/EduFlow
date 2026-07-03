import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuizStore } from "@/stores/useQuizStore";
import { ArrowLeft, Loader, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCourseStore } from "@/stores/useCourseStore";

export const AllQuizzesPage = () => {
    const { courseId } = useParams();

    const { authUser } = useAuthStore();

    const { getCourseById, isGettingCourse, fetchedCourse } = useCourseStore();

    const {
        getAllQuizForCourse,
        isGettingQuizForCourse,
        allQuizForCourse,
        deleteQuiz,
        isDeletingQuiz,
    } = useQuizStore();

    const handleQuizDelete = (quizId) => {
        deleteQuiz(quizId);
    };

    useEffect(() => {
        getAllQuizForCourse(courseId);
        getCourseById(courseId);

        //eslint-disable-next-line
    }, [courseId]);

    if (isGettingQuizForCourse || isGettingCourse) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    let serialNo = 1;

    return (
        <div className="h-full w-full flex flex-col justify-center items-center relative">
            <Link to={"/"} className="hidden md:block absolute top-5 left-5 cursor-none">
                <ArrowLeft />
            </Link>
            <h1 className="text-lg text-center md:text-2xl lg:text-4xl underline underline-offset-4 mb-3">
                <span className="font-bold">{fetchedCourse?.data?.title}</span>{" "}
                Course Quizzes
            </h1>
            <p className="text-xs text-center md:text-sm lg:text-lg text-muted-foreground">
                Below you will find all the quizzes, knowledge checks, and exams
                assigned to this course.
            </p>
            <div className="h-full w-full flex flex-col border border-dashed border-pink-200 dark:border-pink-950 my-2 rounded-2xl overflow-y-auto no-scroll">
                {allQuizForCourse?.data?.quizzes?.length > 0 ? (
                    allQuizForCourse?.data?.quizzes?.map((quiz) => (
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
                            <div className="flex flex-wrap justify-center items-center gap-5">
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
                                {authUser?.data?.role !== "STUDENT" && (
                                    <Button
                                        variant="outlineDelete"
                                        className={cn("cursor-pointer")}
                                        onClick={() =>
                                            handleQuizDelete(quiz.id)
                                        }
                                        disabled={isDeletingQuiz}
                                    >
                                        <Trash2 />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full w-full">
                        <h6 className="h-full w-full flex justify-center items-center text-3xl font-semibold text-center">
                            No quizzes found...
                        </h6>
                    </div>
                )}
            </div>
        </div>
    );
};
