import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    CircleX,
    Crown,
    TrendingUp,
    Eye,
    EyeClosed,
    PersonStanding,
    GraduationCap,
    CrownIcon,
} from "lucide-react";

//Shadcn components
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export const ProfilePage = () => {
    const { authUser, deleteUser, isDeletingUser } = useAuthStore();

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [isDialogueOpen, setIsDialogueOpen] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault();
        const success = await deleteUser(password);

        if (success) {
            setIsDialogueOpen(false);
            setPassword("");

            setTimeout(() => {
                navigate("/signup");
            }, 1000);
        }
    };

    return (
        <div className={cn("h-full w-full flex justify-center items-center")}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        All your profile details at one spot
                    </CardDescription>
                    <CardAction>
                        <Button asChild variant="ghost">
                            <Link
                                to={"/"}
                                className="hover:text-hover-text cursor-pointer"
                            >
                                <ArrowLeft /> Home
                            </Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent
                    className={cn("flex justify-evenly items-center gap-2")}
                >
                    <div className="h-full w-[30%]">
                        {authUser?.data?.image ? (
                            <img src={authUser?.data?.image} />
                        ) : (
                            <img
                                src={
                                    authUser?.image ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.data?.name)}&background=2A9D8F&color=1C1C1C&size=64`
                                }
                                alt="User Avatar"
                                className="object-cover border-2 border-black dark:border-white rounded-md h-full w-full"
                            />
                        )}
                    </div>
                    <div className="flex-1 w-[70%]">
                        <Label className={cn("mb-4")}>
                            <span className="font-semibold">Name:</span>
                            {authUser?.data?.name}
                        </Label>

                        <Label className={cn("mb-4")}>
                            <div className="flex justify-center items-center gap-2">
                                <span className="font-semibold">Email:</span>
                                {authUser?.data?.email}
                                {authUser?.data?.isVerified ? (
                                    <CheckCircle2
                                        size={"15px"}
                                        className="text-emerald-400"
                                    />
                                ) : (
                                    <Link to={"/reverify"}>
                                        <CircleX
                                            size={"15px"}
                                            className="text-red-500"
                                        />
                                    </Link>
                                )}
                            </div>
                        </Label>

                        <Label className={cn("mb-4")}>
                            <span className="font-semibold">Role:</span>
                            {authUser?.data?.role}{" "}
                            {authUser?.data?.role === "INSTRUCTOR" && (
                                <GraduationCap />
                            )}{" "}
                            {authUser?.data?.role === "STUDENT" && (
                                <PersonStanding />
                            )}
                            {authUser?.data?.role === "ADMIN" && <CrownIcon />}
                        </Label>

                        <Label>
                            <span className="font-semibold">Joined:</span>
                            {new Date(
                                authUser?.data?.createdAt,
                            ).toLocaleDateString()}
                        </Label>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        asChild
                        type="submit"
                        className="w-full cursor-pointer font-semibold"
                    >
                        <Link to={"/me/edit"}>Update Profile</Link>
                    </Button>

                    {/* Delete user button */}
                    <AlertDialog
                        open={isDialogueOpen}
                        onOpenChange={setIsDialogueOpen}
                    >
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="w-full font-semibold"
                            >
                                Delete User
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="flex flex-col gap-4">
                                <Label htmlFor="password">
                                    Current Password:{" "}
                                </Label>
                                <div className="flex gap-5">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
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
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeletingUser}>
                                    Cancel
                                </AlertDialogCancel>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={isDeletingUser || !password}
                                >
                                    {isDeletingUser
                                        ? "Deleting..."
                                        : "Delete Account"}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
};
