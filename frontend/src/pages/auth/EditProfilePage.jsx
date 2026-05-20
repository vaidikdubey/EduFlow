import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

export const EditProfilePage = () => {
    const navigate = useNavigate();

    const { updateProfile, isUpdatingProfile, authUser } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { isDirty },
    } = useForm({
        defaultValues: {
            name: authUser?.data?.name || "",
            email: authUser?.data?.email || "",
        },
    });

    const onSubmit = async (data) => {
        if (data?.email === authUser?.data?.email) {
            delete data.email; // Remove email if it's the same as the current email to avoid re-verification trigger
        }

        const success = await updateProfile(data);

        if (success) navigate("/me", { replace: true });
    };

    return (
        <div className={cn("flex flex-col justify-center items-center h-full")}>
            <Card className={cn("w-full max-w-sm")}>
                <CardHeader>
                    <CardTitle className={cn("text-2xl")}>
                        Update your profile
                    </CardTitle>
                    <CardDescription className={cn("text-sm w-full")}>
                        Manage your personal details and keep your account
                        information up to date.
                    </CardDescription>
                    <CardAction>
                        <Button
                            asChild
                            variant="ghost"
                            className={cn(
                                "cursor-pointer hover:text-hover-text hover:font-bold",
                            )}
                        >
                            <Link to={"/me"}>
                                <ArrowLeft />
                                Profile
                            </Link>
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
                                placeholder={authUser?.data?.name}
                                className={cn("placeholder:text-stone-400")}
                                {...register("name")}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <Label htmlFor="email" className={cn("my-2")}>
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={authUser?.data?.email}
                                className={cn("placeholder:text-stone-400")}
                                {...register("email")}
                            />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className={cn("w-full cursor-pointer mt-6")}
                            disabled={isUpdatingProfile || !isDirty}
                        >
                            {isUpdatingProfile ? "Updating..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
