import React, { useEffect } from "react";
import { useQuizStore } from "@/stores/useQuizStore";
import { Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { timeAgo } from "@/utils/timeAgo";

export const QuizAttemptPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const {
        getQuizAttempt,
        isGettingQuizAttempt,
        quizAttempts,
        getQuizById,
        isGettingQuiz,
        quizById,
    } = useQuizStore();

    useEffect(() => {
        getQuizAttempt(id);
        getQuizById(id);
        //eslint-disable-next-line
    }, []);

    const handleSingleResponse = (idx) => {
        const attemptId = quizAttempts?.data[idx]?.id;
        const response = quizAttempts?.data?.[idx];

        navigate(`/quiz/myAttempt/${id}/${attemptId}`, {
            state: { attempt: response },
        });
    };

    if (isGettingQuizAttempt || isGettingQuiz) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col gap-5 m-2 border-2 border-dashed border-pink-400 px-5 py-3 rounded-2xl overflow-y-auto no-scroll">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold underline underline-offset-2">
                    {quizById?.data?.title}
                </h1>
                <h5>
                    <span className="font-semibold">Module: </span>
                    {quizById?.data?.module?.title}
                </h5>
            </div>
            <p className="text-center text-2xl text-bold underline underline-offset-2">
                Your Attempts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {quizAttempts?.data?.length > 0 &&
                    quizAttempts?.data?.map((quiz, idx) => (
                        <div
                            key={quiz.id}
                            className="border-2 border-l-8 border-yellow-400 h-fit md:w-fit p-5 rounded-2xl hover:shadow-2xl cursor-pointer"
                            onClick={() => handleSingleResponse(idx)}
                        >
                            <p>Attempt {idx + 1}</p>
                            <p>Score: {quiz.score}</p>
                            <p>Attempted on: {timeAgo(quiz.attemptedAt)}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};
