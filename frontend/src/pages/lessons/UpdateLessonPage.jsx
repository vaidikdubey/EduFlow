import React, { useEffect } from "react";
import { useLessonStore } from "@/stores/useLessonStore";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateLessonSchema } from "@/lib/zod";
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
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export const UpdateLessonPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const {
        getLessonById,
        isGettingLesson,
        lessonById,
        updateLesson,
        isUpdatingLesson,
        updatedLesson,
    } = useLessonStore();

    useEffect(() => {
        getLessonById(id);
        //eslint-disable-next-line
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm({
        resolver: zodResolver(updateLessonSchema),
        defaultValues: {
            title: "",
            contentType: "",
            contentUrl: "",
            order: null,
        },
    });

    useEffect(() => {
        if (!lessonById?.data?.lesson) return;

        reset({
            title: lessonById?.data?.lesson?.title || "",
            contentType: lessonById?.data?.lesson?.contentType || "",
            contentUrl: lessonById?.data?.lesson?.contentUrl || "",
            order: lessonById?.data?.lesson?.order || null,
        });
    }, [lessonById, reset]);

    if (isGettingLesson) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    const onSubmit = async (data) => {
        const status = await updateLesson(id, data);

        if (status) {
            const moduleId = updatedLesson?.data?.moduleId;

            setTimeout(() => {
                navigate(`/module/get/${moduleId}`, 1000);
            });
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Card className="w-full max-w-lg">
                {" "}
                <CardHeader>
                    <CardTitle className="text-center text-3xl">
                        Update Lesson
                    </CardTitle>
                    <CardDescription className="text-center">
                        Edit lesson details and keep your content up to date.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid gap-2">
                            <div className="flex flex-col gap-2">
                                <Label>Lesson Title</Label>
                                <Input
                                    placeholder="Advanced React Patterns"
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
                                    <Label>Content Type</Label>
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
                            disabled={isUpdatingLesson}
                        >
                            {isUpdatingLesson ? "Updating..." : "Update Lesson"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
