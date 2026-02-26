import React, { useEffect, useState } from "react";
import { useQuizStore } from "@/stores/useQuizStore";
import { ArrowLeft, Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export const AttemptQuiz = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const {
        getQuizById,
        isGettingQuiz,
        quizById,
        submitQuiz,
        isSubmittingQuiz,
    } = useQuizStore();

    useEffect(() => {
        getQuizById(id);
        //eslint-disable-next-line
    }, []);

    const [answer, setAnswer] = useState([]);

    const handleAnswerUpdate = (questionIdx, optionIdx) => {
        const newAnswers = [...answer];
        newAnswers[questionIdx] = optionIdx;
        setAnswer(newAnswers);
    };

    const handleSubmit = async () => {
        if (answer.length < quizById?.data?.questions?.length) {
            toast.error("Please answer all questions before submitting.");
            return;
        }

        const data = { answers: answer };

        const status = await submitQuiz(id, data);

        if (status) {
            const moduleId = quizById?.data?.module?.id;

            setTimeout(navigate(`/module/get/${moduleId}`, 1000));
        }
    };

    if (isGettingQuiz) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex justify-between items-center pr-15">
                <div className="flex justify-center items-center gap-3">
                    <Link to={"/"} className="hidden md:block">
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
                                value={answer[idx]}
                                onValueChange={(value) =>
                                    handleAnswerUpdate(idx, value)
                                }
                                className={cn("flex flex-col gap-2 mt-2")}
                            >
                                {question.options.map((opt, optIdx) => (
                                    <div
                                        key={optIdx}
                                        className="flex items-center gap-3"
                                    >
                                        <RadioGroupItem
                                            value={optIdx}
                                            id={`q${idx}-opt${optIdx}`}
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
            <div className="flex justify-end items-center gap-2 my-2">
                <Button
                    variant="success"
                    onClick={() => handleSubmit()}
                    disabled={isSubmittingQuiz}
                >
                    {isSubmittingQuiz ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </div>
    );
};
