import { useQuizStore } from "@/stores/useQuizStore";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export const QuizAttemptPage = () => {
    const { id } = useParams();

    const { getQuizAttempt, isGettingQuizAttempt, quizAttempts } =
        useQuizStore();

    useEffect(() => {
        getQuizAttempt(id);
        //eslint-disable-next-line
    }, []);

    if (isGettingQuizAttempt) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

  return (
    <div>QuizAttemptPage</div>
  );
};
