import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DotIcon, Loader, Plus, Trash2 } from "lucide-react";
import { CreateQuestionDialogBox } from "./Create Quiz Page/CreateQuestionDialogBox";
import { useQuizStore } from "@/stores/useQuizStore";
import { useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";

export const UpdateQuizPage = () => {
    const { id } = useParams();
    const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);

    const { getQuizById, isGettingQuiz, quizById, updateQuiz, isUpdatingQuiz } =
        useQuizStore();

    const { register, control, handleSubmit, reset, setValue, watch } = useForm(
        {
            defaultValues: {
                title: "",
                questions: [],
            },
        },
    );

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
    });

    const watchedQuestions = watch("questions");

    useEffect(() => {
        getQuizById(id);
    }, [id]);

    useEffect(() => {
        if (quizById?.data) {
            reset({
                title: quizById.data.title,
                questions: quizById.data.questions,
            });
        }
    }, [quizById, reset]);

    const onSubmit = (formData) => {
        updateQuiz(formData, id);
    };

    if (isGettingQuiz) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full max-w-6xl mx-auto border-l-2 border-r-2 px-5 overflow-y-auto no-scroll">
            <div className="flex flex-col items-start justify-center">
                <Input
                    type="text"
                    placeholder="Update quiz title"
                    className={cn(
                        "mb-5 placeholder:text-muted-foreground placeholder:p-2 sticky top-2 z-10",
                    )}
                    {...register("title")}
                />
            </div>
            <div className="h-fit w-full border-dashed flex flex-col items-center">
                <div className="flex flex-col w-full gap-3 mb-5">
                    {fields.map((field, idx) => {
                        return (
                            <div
                                key={field.id}
                                className="bg-gray-200 dark:bg-gray-800 rounded-xl p-3 flex justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold">
                                            {idx + 1}.
                                        </h3>
                                        <input
                                            className="bg-transparent border-none outline-none focus:ring-0 w-full font-semibold"
                                            {...register(
                                                `questions.${idx}.question`,
                                            )}
                                        />
                                    </div>
                                    {field.options.map((_, i) => {
                                        const isCorrect =
                                            watchedQuestions[idx]?.correct ===
                                            i;

                                        return (
                                            <div key={i}>
                                                <p
                                                    className={cn(
                                                        isCorrect &&
                                                            "text-green-400 font-bold",
                                                        "flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity",
                                                    )}
                                                >
                                                    <DotIcon
                                                        onClick={() =>
                                                            setValue(
                                                                `questions.${idx}.correct`,
                                                                i,
                                                            )
                                                        }
                                                        size={25}
                                                    />
                                                    <input
                                                        className="bg-transparent border-none outline-none focus:ring-0 text-sm"
                                                        {...register(
                                                            `questions.${idx}.options.${i}`,
                                                        )}
                                                    />
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Trash2
                                    size={20}
                                    color="red"
                                    className="cursor-pointer"
                                    onClick={() => remove(idx)}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                    <Button
                        type="button"
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
                        onClick={handleSubmit(onSubmit)}
                    >
                        Submit
                    </Button>
                </div>
                <CreateQuestionDialogBox
                    open={isQuestionDialogOpen}
                    onOpenChange={setIsQuestionDialogOpen}
                    setData={(cb) => {
                        const result = cb({ questions: [] });
                        append(result.questions[0]);
                    }}
                />
            </div>
        </div>
    );
};
