import React, { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export const CreateQuestionDialogBox = ({ open, onOpenChange, setData }) => {
    const [questionObject, setQuestionObject] = useState({
        question: "",
        options: [],
        correct: -1,
    });

    const [currentOption, setCurrentOption] = useState("");

    const [correctOption, setCorrectOption] = useState("");

    const handleOptionAddition = (e) => {
        e.preventDefault();

        if (!currentOption.trim()) return;

        setQuestionObject((prev) => {
            return {
                ...prev,
                options: [...prev.options, currentOption],
            };
        });

        setCurrentOption("");
    };

    const handleOptionRemove = (idx) => {
        setQuestionObject((prev) => {
            return {
                ...prev,
                options: prev.options.filter((_, i) => i !== idx),
            };
        });
    };

    const handleCorrectAddition = (e) => {
        e.preventDefault();

        if (!correctOption.trim()) return;

        const option = questionObject.options.findIndex(
            (opt) => opt === correctOption,
        );

        if (option === -1) {
            toast.error("Invalid correct option");
            return;
        }

        setQuestionObject((prev) => ({ ...prev, correct: option }));
    };

    const handleCorrectRemove = () => {
        setQuestionObject((prev) => ({ ...prev, correct: null }));
    };

    const handleAddQuestion = (onOpenChange) => {
        if (!questionObject.question.trim()) {
            toast.error("Please enter a question");
            return;
        }

        if (!questionObject.options) {
            toast.error("Please enter valid options");
            return;
        }

        if (questionObject.options.length < 2) {
            toast.error("Please enter atlease 2 options");
            return;
        }

        if (questionObject.correct === null || questionObject.correct === -1) {
            toast.error("Please enter correct option");
            return;
        }

        setData((prev) => {
            return {
                ...prev,
                questions: [...prev.questions, questionObject],
            };
        });

        setQuestionObject({
            question: "",
            options: [],
            correct: -1,
        });

        onOpenChange(false);

        toast.success("Question added");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add New Question</DialogTitle>
                    <DialogDescription>
                        Create a question for this quiz.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="question">Question</Label>
                        <Input
                            id="question"
                            name="question"
                            placeholder="Add question"
                            value={questionObject.question}
                            onChange={(e) => {
                                setQuestionObject((prev) => ({
                                    ...prev,
                                    question: e.target.value,
                                }));
                            }}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="options">Options</Label>
                        <div className="flex gap-2">
                            <Input
                                id="options"
                                name="options"
                                placeholder="Enter option here"
                                value={currentOption}
                                onChange={(e) =>
                                    setCurrentOption(e.target.value)
                                }
                            />{" "}
                            <Button onClick={(e) => handleOptionAddition(e)}>
                                Add
                            </Button>
                        </div>
                        {questionObject.options &&
                            questionObject.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center text-muted-foreground"
                                >
                                    {idx + 1}. {option}{" "}
                                    {
                                        <X
                                            size={15}
                                            color="red"
                                            onClick={() =>
                                                handleOptionRemove(idx)
                                            }
                                            className="cursor-pointer"
                                        />
                                    }
                                </div>
                            ))}
                    </Field>
                    <Field>
                        <Label htmlFor="correct">Correct Answer</Label>
                        <div className="flex gap-2">
                            <Input
                                id="correct"
                                name="correct"
                                placeholder="Enter the correct option"
                                value={correctOption}
                                onChange={(e) =>
                                    setCorrectOption(e.target.value)
                                }
                            />
                            <Button onClick={(e) => handleCorrectAddition(e)}>
                                Add
                            </Button>
                        </div>
                        {(questionObject.correct !== null || questionObject.correct !== -1) && (
                            <div className="flex justify-between items-center">
                                <div>
                                    Correct:{" "}
                                    <span className="text-muted-foreground">
                                        {
                                            questionObject.options[
                                                questionObject.correct
                                            ]
                                        }
                                    </span>
                                </div>
                                <X
                                    size={15}
                                    color="red"
                                    onClick={handleCorrectRemove}
                                    className="cursor-pointer"
                                />
                            </div>
                        )}
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={() => {
                            handleAddQuestion(onOpenChange);
                        }}
                    >
                        Add Question
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
