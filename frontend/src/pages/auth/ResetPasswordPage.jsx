import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordRule } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
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

export const ResetPasswordPage = () => {
    const { token } = useParams();

    const { resetPassword } = useAuthStore();

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordSchema = z
        .object({
            password: passwordRule,
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            error: "Passwords don't match",
            path: ["confirmPassword"],
        });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data) => {
        const result = resetPassword(data, token);

        if (result.status) {
            navigate("/", { replace: true });
        }
    };

    return (
        <div className={cn("flex flex-col justify-center items-center h-full")}>
            <Card className={cn("w-full max-w-sm")}>
                <CardHeader>
                    <CardTitle className={cn("text-2xl")}>
                        Create a New Password
                    </CardTitle>
                    <CardDescription className={cn("text-sm w-full")}>
                        Enter your new password below and confirm it.
                    </CardDescription>
                    <CardAction>
                        <Button
                            variant="link"
                            className={cn(
                                "hover:underline cursor-pointer dark:text-pink-400 text-pink-500 hover:font-bold",
                            )}
                        >
                            <Link to={"/signin"}>Sign In?</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        {/* Password Field */}
                        <div>
                            <Label htmlFor="password" className={cn("my-3")}>
                                Password
                            </Label>
                            <div className={cn("flex gap-3")}>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕"
                                    className={cn(
                                        "placeholder:text-stone-400",
                                        errors.password &&
                                            "border-red-500 focus-visible:ring-red-500",
                                    )}
                                    {...register("password")}
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
                            {errors.password && (
                                <p
                                    className={cn(
                                        "text-xs font-medium text-red-500 mt-1",
                                    )}
                                >
                                    {errors.password.message}
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
                            disabled={isSubmitting}
                        >
                            <Link>
                                {isSubmitting
                                    ? "Please wait..."
                                    : "Update Password"}
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
