import React from "react";
import { useModuleStore } from "@/stores/useModuleStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createModuleSchema } from "@/lib/zod";
import { useNavigate, useParams } from "react-router-dom";
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
import { Button } from "@/components/ui/button";

export const CreateModulePage = () => {
    const { courseId } = useParams();

    const navigate = useNavigate();

    const { createModule, isCreatingModule, createdModule } = useModuleStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createModuleSchema),
        defaultValues: {
            title: "",
            order: null,
        },
    });

    const onSubmit = async (data) => {
        const status = await createModule(courseId, data);

        if (status) {
            console.log("Created module: ", createdModule?.data);
            setTimeout(() => navigate(`/course/get/${courseId}`), 1000);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Card className="w-full max-w-lg">
                {" "}
                <CardHeader>
                    <CardTitle className="text-center text-3xl">
                        Create new module
                    </CardTitle>
                    <CardDescription className="text-center">
                        Organize your course into structured learning sections.
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
                                    Module Title
                                    <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    placeholder="Getting Started with React"
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
                                <Label>Module Order</Label>
                                <Input
                                    type="number"
                                    placeholder="Specify the order of this lesson."
                                    {...register("order", {
                                        valueAsNumber: true,
                                    })}
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
                            disabled={isCreatingModule}
                        >
                            {isCreatingModule ? "Creating..." : "Create Module"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
