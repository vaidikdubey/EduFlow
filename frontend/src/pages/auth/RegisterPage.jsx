import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/lib/zod";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const RegisterPage = () => {
    const { signup, isSigninUp } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
        },
    });

    const onSubmit = (data) => {
        signup(data);
    };

    return (
        <div className={cn("flex flex-col justify-center items-center h-full font-sans")}>
            <Card className={cn("w-full max-w-sm")}>
                <CardHeader>
                    <CardTitle className={cn("text-2xl")}>
                        Create new EduFlow Account
                    </CardTitle>
                    <CardDescription className={cn("text-sm w-full")}>
                        Start your learning or teaching journey with EduFlow in
                        just a few steps.
                    </CardDescription>
                    <CardAction>
                        <Button
                            variant="link"
                            className={cn(
                                "hover:underline cursor-pointer hover:text-hover-text hover:font-bold",
                            )}
                            asChild
                        >
                            <Link to={"/signin"}>SignIn?</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        {/* Name field */}
                        <div>
                            <Label htmlFor="name" className={cn("my-2")}>
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                className={cn(
                                    "placeholder:text-stone-400",
                                    errors.name &&
                                        "border-red-500 focus-visible:ring-red-500",
                                )}
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className={cn("text-xs text-red-500 mt-1")}>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

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

                        {/* Role Field */}
                        <div>
                            <div className="flex gap-2 justify-start items-center mt-3">
                                <Label htmlFor="role" className={cn("my-2")}>
                                    Role
                                </Label>
                                <Select
                                    onValueChange={(value) =>
                                        setValue("role", value, {
                                            shouldValidate: true,
                                        })
                                    }
                                    value={watch("role")}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="STUDENT">
                                                STUDENT
                                            </SelectItem>
                                            <SelectItem value="INSTRUCTOR">
                                                INSTRUCTOR
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            {errors.role && (
                                <p className={cn("text-xs text-red-500 mt-1")}>
                                    {errors.role.message}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className={cn("w-full cursor-pointer mt-6")}
                            disabled={isSigninUp}
                        >
                            <Link>
                                {isSigninUp ? "Please wait..." : "Signup"}
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
