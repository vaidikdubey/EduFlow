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

    const handleOptionAddition = (e) => {
        const option = e.target.value;

        if (option) {
            setQuestionObject((prev) => {
                return {
                    ...prev,
                    options: [...prev.options, option],
                };
            });
        }
    };

    const handleOptionRemove = (idx) => {
        setQuestionObject((prev) => {
            return {
                ...prev,
                options: prev.options.filter((_, i) => i !== idx),
            };
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
                        <Input
                            id="options"
                            name="options"
                            placeholder="Add options"
                            onChange={(e) => handleOptionAddition(e)}
                        />
                        {questionObject.options.map((option, idx) => (
                            <div key={idx} className="flex justify-between">
                                {idx + 1}. {option}{" "}
                                {
                                    <X
                                        size={15}
                                        color="red"
                                        onClick={(idx) =>
                                            handleOptionRemove(idx)
                                        }
                                    />
                                }
                            </div>
                        ))}
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Add Question</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
