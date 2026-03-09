import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import { ReadMore } from "@/components/ui/ReadMore";

export const HomePage = () => {
    const { logout } = useAuthStore();

    const { getAllCourses, isGettingAllCourses, allCourses } = useCourseStore();

    const [latestCourse, setLatestCourse] = useState(true);
    const [myEnrollments, setMyEnrollments] = useState(false);

    useEffect(() => {
        getAllCourses();
    }, []);

    const handleLogout = () => {
        logout();
    };

    if (isGettingAllCourses) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    //Latest courses
    //My enrollments

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
            <div className="w-full bg-amber-300 p-3 rounded-2xl text-center">
                Navbar comes here
            </div>
            <div className="w-full flex gap-4">
                <p
                    onClick={() => {
                        (setLatestCourse(true), setMyEnrollments(false));
                    }}
                    className={cn(
                        "cursor-pointer",
                        latestCourse &&
                            "font-bold underline underline-offset-2 text-pink-500",
                    )}
                >
                    New Courses
                </p>
                <p
                    onClick={() => {
                        (setLatestCourse(false), setMyEnrollments(true));
                    }}
                    className={cn(
                        "cursor-pointer",
                        myEnrollments &&
                            "font-bold underline underline-offset-2 text-pink-500",
                    )}
                >
                    My Enrollments
                </p>
            </div>
            <div className="h-full w-full grid grid-cols-3 gap-5 overflow-y-auto no-scroll">
                {latestCourse &&
                    allCourses?.data?.map(
                        (course, idx) =>
                            idx < 6 && (
                                <div
                                    key={course.id}
                                    className="bg-linear-to-br from-cyan-100/20 to-cyan-50 dark:bg-linear-to-br dark:from-cyan-800/20 dark:to-cyan-800/20 rounded-lg p-2"
                                >
                                    <h2 className="text-xl font-bold cursor-pointer hover:underline hover:underline-offset-2 h-15">
                                        <Link
                                            to={`/course/enroll/${course.id}`}
                                        >
                                            {course.title}
                                        </Link>
                                    </h2>
                                    <ReadMore
                                        text={course.description}
                                        maxLen={100}
                                        props={cn("mb-3")}
                                    />
                                    <div className="flex justify-between text-sm">
                                        <p>
                                            <span className="font-semibold">
                                                Type:{" "}
                                            </span>
                                            {course.price ? "PAID" : "FREE"}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Price:{" "}
                                            </span>
                                            {course.price
                                                ? `₹${course.price}`
                                                : "₹0"}
                                        </p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <p>
                                            <span className="font-semibold">
                                                Author:{" "}
                                            </span>
                                            {course.createdBy.name}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Added:{" "}
                                            </span>
                                            {timeAgo(course.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <HoverCard
                                            openDelay={10}
                                            closeDelay={100}
                                        >
                                            <HoverCardTrigger asChild>
                                                <Button variant="hover">
                                                    View Instructors
                                                </Button>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="flex gap-2 h-fit w-fit">
                                                {course.instructors.map(
                                                    (ins, idx) => (
                                                        <span>
                                                            {ins.name}{" "}
                                                            {idx !==
                                                                course
                                                                    .instructors
                                                                    .length -
                                                                    1 && ", "}
                                                        </span>
                                                    ),
                                                )}
                                            </HoverCardContent>
                                        </HoverCard>
                                    </div>
                                    <Button
                                        variant="default"
                                        className={cn("w-full")}
                                    >
                                        Enroll
                                    </Button>
                                </div>
                            ),
                    )}
                {myEnrollments && <div>My enrollments</div>}
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
