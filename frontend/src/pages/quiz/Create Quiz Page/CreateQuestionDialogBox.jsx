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

export const CreateQuestionDialogBox = ({ open, onOpenChange, setData }) => {
    const [questionObject, setQuestionObject] = useState({
        question: "",
        options: [],
        correct: null,
    });

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
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="username-1">Username</Label>
                        <Input
                            id="username-1"
                            name="username"
                            defaultValue="@peduarte"
                        />
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
