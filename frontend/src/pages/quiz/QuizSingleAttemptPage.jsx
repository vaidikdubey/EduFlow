import React from "react";
import { useLocation } from "react-router-dom";

export const QuizSingleAttemptPage = () => {
    const QuizResult = () => {
        const location = useLocation();
        const { attempt } = location.state || {};

        console.log("Attempt: ", attempt);
    };

    QuizResult();

    return <div>QuizSingleAttemptPage</div>;
};
