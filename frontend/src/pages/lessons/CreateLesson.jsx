import React from "react";
import { useLessonStore } from "@/stores/useLessonStore";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLessonSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const CreateLesson = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const { createLesson, isCreatingLesson, createdLesson } = useLessonStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(createLessonSchema),
        defaultValues: {
            title: "",
            contentType: "",
            contentUrl: "",
            order: null,
        },
    });

    const onSubmit = async (data) => {
        const status = await createLesson(id, data);

        if (status) {
            const moduleId = createdLesson?.data?.moduleId;
            setTimeout(() => {
                navigate(`/module/get/${moduleId}`);
            });
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Card className="w-full max-w-lg">
                {" "}
                <CardHeader>
                    <CardTitle className="text-center text-3xl">
                        Create new lesson
                    </CardTitle>
                    <CardDescription className="text-center">
                        Add structured learning content to your course module.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid gap-3">
                            <div className="flex flex-col gap-2">
                                <Label>
                                    Lesson Title
                                    <span className="text-red-400">*</span>
                                </Label>
                                <Input
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
                            </div>
                            <div className="flex flex-col md:flex-row w-full justify-center md:justify-start items-center gap-2 mt-2">
                                <div className="flex flex-col gap-2 w-full">
                                    <Label>
                                        Content Type
                                        <span className="text-red-400">*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setValue("contentType", value, {
                                                shouldValidate: true,
                                            })
                                        }
                                        value={watch("contentType")}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select content type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="TEXT">
                                                    TEXT
                                                </SelectItem>
                                                <SelectItem value="PDF">
                                                    PDF
                                                </SelectItem>
                                                <SelectItem value="VIDEO">
                                                    VIDEO
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.contentType && (
                                        <p
                                            className={cn(
                                                "text-xs text-red-500 mt-1",
                                            )}
                                        >
                                            {errors.contentType.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>
                                    Content URL
                                    <span className="text-red-400">*</span>
                                </Label>
                                <Input
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Lesson Order</Label>
                                <Input
                                    placeholder="Specify the order of this lesson."
                                    {...register("order")}
                                />
                                {errors.order && (
                                    <p
                                        className={cn(
                                            "text-xs font-medium text-red-500 mt-1",
                                        )}
                                    >
                                        {errors.order.message}
                                    </p>
                                )}
                            </div>
                            <p className="text-red-400 text-xs text-right font-semibold">
                                * Required Fields
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                            disabled={isCreatingLesson}
                        >
                            {isCreatingLesson ? "Creating..." : "Create Lesson"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
