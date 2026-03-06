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

export const CreateQuestionDialogBox = ({ open, onOpenChange, setData }) => {
    const [questionObject, setQuestionObject] = useState({
        question: "",
        options: [],
        correct: null,
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

        let option = undefined;

        setQuestionObject((prev) => {
            option = prev.options.filter((opt, i) => opt === correctOption);
        });
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
                                <div key={idx} className="flex justify-between">
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
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={setData((prev) => ({
                            ...prev,
                            questions: [...prev.questions, questionObject],
                        }))}
                    >
                        Add Question
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
