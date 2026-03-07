import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useQuizStore } from "@/stores/useQuizStore";
import { ArrowLeft, Loader } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const QuizSingleAttemptPage = () => {
    const { id } = useParams();

    const { getQuizById, isGettingQuiz, quizById } = useQuizStore();

    let quizAttempt;

    const QuizResult = () => {
        const location = useLocation();
        const { attempt } = location.state || {};

        quizAttempt = attempt;
    };

    QuizResult();

    useEffect(() => {
        getQuizById(id);
        //eslint-disable-next-line
    }, []);

    if (isGettingQuiz) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pr-15">
                <div className="flex justify-center items-center gap-3">
                    <Link
                        to={`/quiz/myAttempts/${id}`}
                        className="hidden md:block"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold underline underline-offset-2">
                            {quizById?.data?.title}
                        </h1>
                        <h5>
                            <span className="font-semibold">Module: </span>
                            {quizById?.data?.module?.title}
                        </h5>
                    </div>
                </div>
                <p>
                    <span>Total Attempts: </span>
                    {quizById?.data?.totalAttempts}
                </p>
            </div>
            <div className="flex-1 flex flex-col border-2 border-dashed rounded-2xl px-5 py-2 my-2 overflow-y-auto no-scroll">
                {quizById?.data?.questions?.length > 0 &&
                    quizById?.data?.questions?.map((question, idx) => (
                        <div key={idx} className="mb-2">
                            <h6 className="text-lg">
                                {idx + 1}. {question.question}
                            </h6>
                            <RadioGroup
                                className={cn("flex flex-col gap-2 mt-2")}
                                value={quizAttempt?.answers[idx]}
                                disabled={true}
                            >
                                {question.options.map((opt, optIdx) => (
                                    <div
                                        key={optIdx}
                                        className="flex items-center gap-3"
                                    >
                                        <RadioGroupItem
                                            value={optIdx}
                                            id={`q${idx}-opt${optIdx}`}
                                            default
                                            className={cn(
                                                optIdx === question.correct
                                                    ? "border-green-400 [&+label]:text-green-400 [&+label]:font-semibold data-[state=checked]:[&_svg]:fill-green-400 data-[state=checked]:[&_svg]:text-green-400"
                                                    : "data-[state=checked]:[&_svg]:fill-yellow-700 data-[state=checked]:[&_svg]:text-yellow-700 dark:data-[state=checked]:[&_svg]:fill-sky-400 dark:data-[state=checked]:[&_svg]:text-sky-400",
                                            )}
                                        />
                                        <Label htmlFor={`q${idx}-opt${optIdx}`}>
                                            {opt}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
            </div>
            <div className="flex justify-between items-center px-2">
                <p>
                    <span className="font-bold">Submitted: </span>
                    {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    }).format(new Date(quizAttempt?.attemptedAt))}
                </p>
                <p>
                    <span className="font-bold">Score: </span>
                    {quizAttempt?.score}
                </p>
            </div>
        </div>
    );
};
