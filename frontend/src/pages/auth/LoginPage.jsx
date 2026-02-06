import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";

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

export const LoginPage = () => {
    const { login, isLoggingIn } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data) => {
        login(data);
    };

    return (
        <div className={cn("flex flex-col justify-center items-center h-full")}>
            <Card className={cn("w-full max-w-sm")}>
                <CardHeader>
                    <CardTitle className={cn("text-2xl")}>
                        Welcome Back to EduFlow!
                    </CardTitle>
                    <CardDescription className={cn("text-sm w-full")}>
                        Continue your learning or teaching journey. Sign in to
                        access your dashboard.
                    </CardDescription>
                    <CardAction>
                        <Button
                            variant="link"
                            className={cn(
                                "hover:underline cursor-pointer dark:text-pink-400 text-pink-500 hover:font-bold",
                            )}
                        >
                            <Link to={"/signup"}>Sign Up?</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        {/* Email Field */}
                        <div>
                            <Label htmlFor="email" className={cn("my-2")}>
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
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

                        {/* Password Field */}
                        <div>
                            <div
                                className={cn(
                                    "flex justify-between items-center",
                                )}
                            >
                                <Label
                                    htmlFor="password"
                                    className={cn("my-3")}
                                >
                                    Password
                                </Label>
                                <Link
                                    to={"/forgot-password"}
                                    className={cn(
                                        "text-xs text-muted-foreground hover:underline hover:text-hover-text",
                                    )}
                                >
                                    Forgot password?
                                </Link>
                            </div>
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
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className={cn("w-full cursor-pointer mt-6")}
                            disabled={isLoggingIn}
                        >
                            <Link>
                                {isLoggingIn ? "Please wait..." : "Login"}
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
