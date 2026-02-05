import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link } from "react-router-dom";
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

export const ForgotPasswordPage = () => {
    const { forgotPassword } = useAuthStore();

    const emailSchema = z.object({
        email: z.email("Enter a valid email"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (data) => {
        forgotPassword(data);
    };

    return (
        <div className={cn("flex flex-col justify-center items-center h-full")}>
            <Card className={cn("w-full max-w-sm")}>
                <CardHeader>
                    <CardTitle className={cn("text-2xl")}>
                        Reset Your Password
                    </CardTitle>
                    <CardDescription className={cn("text-sm w-full")}>
                        Enter the email associated with your account and we’ll
                        send you a link to reset your password.
                    </CardDescription>
                    <CardAction>
                        <Button
                            variant="link"
                            className={cn(
                                "hover:underline cursor-pointer hover:text-hover-text hover:font-bold",
                            )}
                        >
                            <Link to={"/signin"}>Sign In?</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <p className={cn("text-xs py-2 text-stone-400")}>
                            * Make sure you enter the same email you used during
                            registration. The reset link will be valid for a
                            limited time.
                        </p>
                        {/* Email Field */}
                        <div>
                            <Label htmlFor="email" className={cn("my-2")}>
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Your registered email"
                                className={cn(
                                    "placeholder:text-stone-400",
                                    errors.email &&
                                        "border-red-500 focus-visible:ring-red-500",
                                )}
                                {...register("email")}
                            />
                            {errors.email && (
                                <p
                                    className={cn(
                                        "text-xs font-medium text-red-500 mt-1",
                                    )}
                                >
                                    {errors.email.message}
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
                                    : "Send Reset Link"}
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
