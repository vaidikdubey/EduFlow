import React, { useEffect } from "react";
import { useModuleStore } from "@/stores/useModuleStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Loader } from "lucide-react";

export const UpdateModulePage = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const {
        getModuleById,
        isGettingModule,
        moduleById,
        updateModule,
        isUpdatingModule,
        updatedModule,
    } = useModuleStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(),
        defaultValues: {
            title: "",
            order: null,
        },
    });

    useEffect(() => {
        getModuleById(id);
        //eslint-disable-next-line
    }, [id]);

    useEffect(() => {
        if (!moduleById?.data?.title) return;

        reset({
            title: moduleById?.data?.title || "",
        });
    }, [moduleById, reset]);

    const onSubmit = async (data) => {
        updateModule(id, data);
        // if (status) {
        //     console.log("Created module: ", createdModule?.data);
        //     setTimeout(() => navigate(`/course/get/${courseId}`), 1000);
        // }
    };

    if (isGettingModule) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Card className="w-full max-w-lg">
                {" "}
                <CardHeader>
                    <CardTitle className="text-center text-3xl">
                        Update module
                    </CardTitle>
                    <CardDescription className="text-center">
                        Edit module details and keep your content up to date.
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
                                    placeholder="Update the order of this lesson. Leave blank if unsure of order."
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
                            disabled={isUpdatingModule}
                        >
                            {isUpdatingModule ? "Updating..." : "Update Module"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
