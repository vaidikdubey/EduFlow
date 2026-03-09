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
                    <div className="bg-gray-300 rounded-lg p-2">
                        <h2 className="">{course.title}</h2>
                        <p>{course.description}</p>
                        <div>
                            <p>
                                <span>Type: </span>
                                {course.price ? "PAID" : "FREE"}
                            </p>
                            <p>
                                <span>Price: </span>
                                {course.price ? `₹${course.price}` : "₹0"}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span>Author: </span>
                                {course.createdBy.name}
                            </p>
                            <p>
                                <span>Added: </span>
                                {timeAgo(course.createdAt)}
                            </p>
                        </div>
                        <HoverCard openDelay={10} closeDelay={100}>
                            <HoverCardTrigger asChild>
                                <Button variant="hover">Instructors</Button>
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
