import React, { useEffect } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourseSchema } from "@/lib/zod";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

export const CreateCoursePage = () => {
    const navigate = useNavigate();

    const {
        isCreatingCourse,
        createdCourse,
        createCourse,
        getAllInstructors,
        allInstructors,
    } = useCourseStore();

    useEffect(() => {
        getAllInstructors();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            title: "",
            description: "",
            type: "",
            price: undefined,
            instructors: [],
        },
    });

    useEffect(() => {
        register("type");
        register("instructors");
    }, [register]);

    const instructors = watch("instructors") ?? [];

    const courseType = watch("type");

    const availableInstructors = allInstructors?.data?.map((ins) => ({
        id: ins.id,
        name: ins.name,
    }));

    const toggleInstructor = (id) => {
        setValue(
            "instructors",
            instructors.includes(id)
                ? instructors.filter((i) => i !== id)
                : [...instructors, id],
            {
                shouldValidate: true,
                shouldDirty: true,
            },
        );
    };

    const onSubmit = async (data) => {
        const success = await createCourse(data);

        if (success)
            setTimeout(() => {
                navigate(`/course/get/${createdCourse?.data?.id}`);
            }, 1000);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Card className="w-full max-w-lg">
                {" "}
                <CardHeader>
                    <CardTitle className="text-center text-3xl">
                        Create new course
                    </CardTitle>
                    <CardDescription className="text-center">
                        Set up your course details and start building structured
                        learning content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid gap-2">
                            <div className="flex flex-col gap-2">
                                <Label>Course Title</Label>
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
                            <div className="flex flex-col gap-2">
                                <Label>Course Description</Label>
                                <Textarea
                                    placeholder="What will students learn in this course?"
                                    {...register("description")}
                                />
                                {errors.description && (
                                    <p
                                        className={cn(
                                            "text-xs font-medium text-red-500 mt-1",
                                        )}
                                    >
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row w-full justify-center md:justify-start items-center gap-2 mt-2">
                                <div className="flex gap-2 w-full md:max-w-[40%]">
                                    <Label>Type</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setValue("type", value, {
                                                shouldValidate: true,
                                            })
                                        }
                                        value={watch("type")}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select course type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="FREE">
                                                    FREE
                                                </SelectItem>
                                                <SelectItem value="PAID">
                                                    PAID
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && (
                                        <p
                                            className={cn(
                                                "text-xs text-red-500 mt-1",
                                            )}
                                        >
                                            {errors.type.message}
                                        </p>
                                    )}
                                </div>
                                {courseType === "PAID" && (
                                    <div className="flex gap-2 w-full">
                                        <Label>Price(₹)</Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 999"
                                            {...register("price", {
                                                valueAsNumber: true,
                                            })}
                                        />

                                        {errors.price && (
                                            <p className="text-xs font-medium text-red-500 mt-1">
                                                {errors.price.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Instructors selection */}
                        <div className="grid gap-2">
                            <Label>Instructors</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                    >
                                        {instructors.length === 0
                                            ? "Select instructors"
                                            : `${instructors.length} instructor${instructors.length > 1 ? "s" : ""} selected`}
                                        <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                                    {availableInstructors?.map((inst) => (
                                        <DropdownMenuCheckboxItem
                                            key={inst.id}
                                            checked={instructors.includes(
                                                inst.id,
                                            )}
                                            onCheckedChange={() =>
                                                toggleInstructor(inst.id)
                                            }
                                            // prevent menu from closing on click
                                            onSelect={(e) => {
                                                e.preventDefault();
                                            }}
                                        >
                                            {inst.name}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {instructors.length > 0 && (
                                <div className="text-sm text-muted-foreground mt-1">
                                    Selected:{" "}
                                    {availableInstructors
                                        .filter((i) =>
                                            instructors.includes(i.id),
                                        )
                                        .map((i) => i.name)
                                        .join(", ")}
                                </div>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                            disabled={isCreatingCourse}
                        >
                            {isCreatingCourse ? "Creating..." : "Create Course"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
