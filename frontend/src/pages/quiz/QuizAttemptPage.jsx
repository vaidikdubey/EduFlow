import { useQuizStore } from "@/stores/useQuizStore";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export const QuizAttemptPage = () => {
    const { id } = useParams();

    const { getQuizAttempt, isGettingQuizAttempt, quizAttempt } =
        useQuizStore();

    useEffect(() => {
        getQuizAttempt(id);
        //eslint-disable-next-line
    }, []);

    return <div>QuizAttemptPage</div>;
};
