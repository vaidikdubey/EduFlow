import React from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBulkLessonSchema } from "@/lib/zod";

export const LessonDialog = ({ open, setOpen, onAddLesson }) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createBulkLessonSchema),
        defaultValues: {
            title: "",
            contentType: "TEXT",
            contentUrl: "",
        },
    });

    const onSubmit = async (data) => {
        onAddLesson(data);

        reset();

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
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
                                placeholder="Basics of React"
                                {...register("title")}
                            />
                            {errors.title && (
                                <p
                                    className={cn(
                                        "text-xs font-medium text-red-500 mt-1",
                                    )}
                                >
                                    {errors.title.message}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <Label htmlFor="content-type">Content Type</Label>
                            <Select
                                onValueChange={(value) =>
                                    setValue("contentType", value, {
                                        shouldValidate: true,
                                    })
                                }
                                value={watch("contentType")}
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
                            {errors.contentType && (
                                <p className={cn("text-xs text-red-500 mt-1")}>
                                    {errors.contentType.message}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <Label htmlFor="content-url">Content URL</Label>
                            <Input
                                id="content-url"
                                placeholder={`https://www.example-content-url.com`}
                                {...register("contentUrl")}
                            />
                            {errors.contentUrl && (
                                <p
                                    className={cn(
                                        "text-xs font-medium text-red-500 mt-1",
                                    )}
                                >
                                    {errors.contentUrl.message}
                                </p>
                            )}
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
