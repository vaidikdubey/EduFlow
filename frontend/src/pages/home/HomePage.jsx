import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCourseStore } from "@/stores/useCourseStore";
import { timeAgo } from "@/utils/timeAgo";
import { Loader } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

export const HomePage = () => {
    const { logout } = useAuthStore();

    const { getAllCourses, isGettingAllCourses, allCourses } = useCourseStore();

    useEffect(() => {
        getAllCourses();
    }, []);

    const handleLogout = () => {
        logout();
    };

    console.log("All courses: ", allCourses?.data);

    if (isGettingAllCourses) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
            <div className="h-full w-full grid grid-cols-4 gap-5 overflow-y-auto no-scroll">
                {allCourses?.data?.map((course) => (
                    <div className="bg-linear-to-br from-cyan-100/20 to-cyan-50 dark:bg-linear-to-br dark:from-cyan-800/20 dark:to-cyan-800/20 rounded-lg p-2">
                        <h2 className="text-xl font-bold cursor-pointer hover:underline hover:underline-offset-2">
                            {course.title}
                        </h2>
                        <p className="text-sm">{course.description}</p>
                        <div className="flex justify-between text-sm">
                            <p>
                                <span className="font-semibold">Type: </span>
                                {course.price ? "PAID" : "FREE"}
                            </p>
                            <p>
                                <span className="font-semibold">Price: </span>
                                {course.price ? `₹${course.price}` : "₹0"}
                            </p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p>
                                <span className="font-semibold">Author: </span>
                                {course.createdBy.name}
                            </p>
                            <p>
                                <span className="font-semibold">Added: </span>
                                {timeAgo(course.createdAt)}
                            </p>
                        </div>
                        <div className="flex justify-start items-center mx-0">
                            <HoverCard openDelay={10} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <Button variant="hover" className={cn("text-start")}>Instructors</Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="flex gap-2 h-fit w-fit">
                                    {course.instructors.map((ins, idx) => (
                                        <span>
                                            {ins.name}{" "}
                                            {idx !==
                                                course.instructors.length - 1 &&
                                                ", "}
                                        </span>
                                    ))}
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                variant="destructive"
                onClick={handleLogout}
                className={cn("cursor-pointer")}
            >
                Logout?
            </Button>
        </div>
    );
};
