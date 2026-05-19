import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordRule } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeClosed } from "lucide-react";
import z from "zod";

//Shadcn components
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ChangePasswordPage = () => {
    const navigate = useNavigate();

    const { changePassword, isChangingPassword } = useAuthStore();

    const [showOldPassword, setShowOldPassword] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordSchema = z
        .object({
            oldPassword: z.string(),
            newPassword: passwordRule,
            confirmPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            error: "Passwords don't match",
            path: ["confirmPassword"],
        });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data) => {
        const success = await changePassword(data);

        if (success) navigate("/", { replace: true });
    };

    return (
        <div className={cn("flex flex-col justify-center items-center h-full")}>
            <Card className={cn("w-full max-w-sm")}>
                <CardHeader>
                    <CardTitle className={cn("text-2xl")}>
                        Create New Password
                    </CardTitle>
                    <CardDescription className={cn("text-sm w-full")}>
                        Enter your new password below and confirm it.
                    </CardDescription>
                    <CardAction>
                        <Button
                            asChild
                            variant="ghost"
                            className={cn(
                                "cursor-pointer hover:text-hover-text hover:font-bold",
                            )}
                        >
                            <Link to={"/"}>
                                <ArrowLeft />
                                Home
                            </Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        {/* Old Password Field */}
                        <div>
                            <Label htmlFor="oldPassword" className={cn("my-3")}>
                                Old Password
                            </Label>
                            <div className={cn("flex gap-3")}>
                                <Input
                                    id="oldPassword"
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder="⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕"
                                    className={cn(
                                        "placeholder:text-stone-400",
                                        errors.oldPassword &&
                                            "border-red-500 focus-visible:ring-red-500",
                                    )}
                                    {...register("oldPassword")}
                                />
                                <Button
                                    type="button"
                                    onClick={() =>
                                        setShowOldPassword(!showOldPassword)
                                    }
                                    className={cn("cursor-pointer")}
                                >
                                    {showOldPassword ? (
                                        <Eye className="h-5 w-5 text-base-content/40" />
                                    ) : (
                                        <EyeClosed className="h-5 w-5 text-base-content/40" />
                                    )}
                                </Button>
                            </div>
                            {errors.oldPassword && (
                                <p
                                    className={cn(
                                        "text-xs font-medium text-red-500 mt-1",
                                    )}
                                >
                                    {errors.oldPassword.message}
                                </p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div>
                            <Label htmlFor="newPassword" className={cn("my-3")}>
                                New Password
                            </Label>
                            <div className={cn("flex gap-3")}>
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕"
                                    className={cn(
                                        "placeholder:text-stone-400",
                                        errors.password &&
                                            "border-red-500 focus-visible:ring-red-500",
                                    )}
                                    {...register("newPassword")}
                                />
                                <Button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className={cn("cursor-pointer")}
                                >
                                    {showPassword ? (
                                        <Eye className="h-5 w-5 text-base-content/40" />
                                    ) : (
                                        <EyeClosed className="h-5 w-5 text-base-content/40" />
                                    )}
                                </Button>
                            </div>
                            {errors.newPassword && (
                                <p
                                    className={cn(
                                        "text-xs font-medium text-red-500 mt-1",
                                    )}
                                >
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <Label
                                htmlFor="confirmPassword"
                                className={cn("my-3")}
                            >
                                Confirm Password
                            </Label>
                            <div className={cn("flex gap-3")}>
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕"
                                    className={cn(
                                        "placeholder:text-stone-400",
                                        errors.confirmPassword &&
                                            "border-red-500 focus-visible:ring-red-500",
                                    )}
                                    {...register("confirmPassword")}
                                />
                                <Button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className={cn("cursor-pointer")}
                                >
                                    {showConfirmPassword ? (
                                        <Eye className="h-5 w-5 text-base-content/40" />
                                    ) : (
                                        <EyeClosed className="h-5 w-5 text-base-content/40" />
                                    )}
                                </Button>
                            </div>
                            {errors.confirmPassword && (
                                <p
                                    className={cn(
                                        "text-xs font-medium text-red-500 mt-1",
                                    )}
                                >
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className={cn("w-full cursor-pointer mt-6")}
                            disabled={isChangingPassword}
                        >
                            {isChangingPassword
                                ? "Please wait..."
                                : "Update Password"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
