import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const LessonDialog = ({ open, setOpen, onAddLesson }) => {
    const [lessonForm, setLessonForm] = useState({
        title: "",
        contentType: "TEXT",
        contentUrl: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        onAddLesson(lessonForm);

        setLessonForm({
            title: "",
            contentType: "TEXT",
            contentUrl: "",
        });

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Lesson</DialogTitle>
                        <DialogDescription>
                            This lesson will be added to the creation queue and
                            won't be saved until you create all lessons.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Basics of React"
                                value={lessonForm?.title}
                                onChange={(e) =>
                                    setLessonForm((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="content-type">Content Type</Label>
                            <Select
                                value={lessonForm?.contentType}
                                onValueChange={(value) =>
                                    setLessonForm((prev) => ({
                                        ...prev,
                                        contentType: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TEXT">TEXT</SelectItem>
                                    <SelectItem value="PDF">PDF</SelectItem>
                                    <SelectItem value="VIDEO">VIDEO</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <Label htmlFor="content-url">Content URL</Label>
                            <Input
                                id="content-url"
                                name="content-url"
                                placeholder="www.example-resouce.com"
                                value={lessonForm?.contentUrl}
                                onChange={(e) =>
                                    setLessonForm((prev) => ({
                                        ...prev,
                                        contentUrl: e.target.value,
                                    }))
                                }
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter className={cn("mt-7")}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Add Lesson</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
