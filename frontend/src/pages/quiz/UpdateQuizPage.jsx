import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DotIcon, Loader, Plus, Trash2 } from "lucide-react";
import { CreateQuestionDialogBox } from "./Create Quiz Page/CreateQuestionDialogBox";
import { useQuizStore } from "@/stores/useQuizStore";
import { useParams } from "react-router-dom";

export const UpdateQuizPage = () => {
    const { id } = useParams();

    const [data, setData] = useState({ title: "", questions: [] });
    const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);

    const {
        getQuizById,
        isGettingQuiz,
        quizById,
        updateQuiz,
        isUpdatingQuiz,
        updatedQuiz,
    } = useQuizStore();

    useEffect(() => {
        getQuizById(id);
    }, [id]);

    console.log("Quiz: ", quizById?.data);

    const handleTitleChange = (e) => {
        setData((prev) => ({
            title: e.target.value,
            questions: [...prev.questions],
        }));
    };

    const handleQuestionDelete = (idx) => {
        setData((prev) => ({
            title: prev.title,
            questions: prev.questions.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = () => {
        updateQuiz(data, id);
    };

    let serial = 1;

    if (isGettingQuiz) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full max-w-6xl mx-auto border-l-2 border-r-2 px-5 overflow-y-auto no-scroll">
            <Input
                type="text"
                placeholder="Update quiz title"
                className={cn(
                    "mb-5 placeholder:text-muted-foreground placeholder:p-2 sticky top-2 z-10",
                )}
                onChange={(e) => handleTitleChange(e)}
                value={data.title ?? ""}
            />
            <div className="h-fit w-full border-dashed flex flex-col items-center">
                <div className="flex flex-col w-full gap-3 mb-5">
                    {quizById?.data?.questions?.map((question, idx) => {
                        return (
                            <div
                                key={idx}
                                className="bg-gray-200 dark:bg-gray-800 rounded-xl p-3 flex justify-between"
                            >
                                <div>
                                    <h3>
                                        {serial++}. {question.question}
                                    </h3>
                                    {question.options.map((opt, i) => {
                                        return (
                                            <div key={i}>
                                                <p
                                                    className={cn(
                                                        i ===
                                                            question.correct &&
                                                            "text-green-400",
                                                        "flex items-center gap-1",
                                                    )}
                                                >
                                                    <DotIcon size={25} /> {opt}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Trash2
                                    size={20}
                                    color="red"
                                    className="cursor-pointer"
                                    onClick={() => handleQuestionDelete(idx)}
                                />
                            </div>
                        );
                    })}
                    {data.questions.map((question, idx) => {
                        return (
                            <div
                                key={idx}
                                className="bg-gray-200 dark:bg-gray-800 rounded-xl p-3 flex justify-between"
                            >
                                <div>
                                    <h3>
                                        {serial++}. {question.question}
                                    </h3>
                                    {question.options.map((opt, i) => {
                                        return (
                                            <div key={i}>
                                                <p
                                                    className={cn(
                                                        i ===
                                                            question.correct &&
                                                            "text-green-400",
                                                        "flex items-center gap-1",
                                                    )}
                                                >
                                                    <DotIcon size={25} /> {opt}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Trash2
                                    size={20}
                                    color="red"
                                    className="cursor-pointer"
                                    onClick={() => handleQuestionDelete(idx)}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                    <Button
                        onClick={() => setIsQuestionDialogOpen(true)}
                        className={cn(
                            "w-full cursor-pointer hover:shadow-2xl text-lg font-semibold",
                        )}
                        disabled={isUpdatingQuiz}
                    >
                        <Plus fontWeight={"semibold"} /> Add Question
                    </Button>
                    <Button
                        variant="success"
                        className={cn(
                            "w-full cursor-pointer hover:shadow-2xl text-lg font-semibold",
                        )}
                        disabled={isUpdatingQuiz}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>
                <CreateQuestionDialogBox
                    open={isQuestionDialogOpen}
                    onOpenChange={setIsQuestionDialogOpen}
                    setData={setData}
                />
            </div>
        </div>
    );
};
