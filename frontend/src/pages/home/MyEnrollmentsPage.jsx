import { Button } from "@/components/ui/button";
import { HoverInfo } from "@/components/ui/hover-info";
import { ReadMore } from "@/components/ui/ReadMore";
import { cn } from "@/lib/utils";
import { useEnrollmentStore } from "@/stores/useEnrollmentStore";
import { timeAgo } from "@/utils/timeAgo";
import { ArrowLeft, Loader } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const MyEnrollmentsPage = () => {
    const navigate = useNavigate();

    const { getMyEnrollments, isGettingMyEnrollments, myEnrollments } =
        useEnrollmentStore();

    useEffect(() => {
        getMyEnrollments();
        //eslint-disable-next-line
    }, []);

    if (isGettingMyEnrollments) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full flex flex-col gap-10">
            <HoverInfo
                children={<ArrowLeft
                onClick={() => navigate("/")}
                className="absolute top-3 left-3 cursor-pointer"
                />}
            content={"Navigate to home page"}
            />
            <h1 className="text-center text-3xl font-bold underline underline-offset-2">
                My Enrollments
            </h1>
            <div className="h-full w-full grid grid-cols-3 gap-5 overflow-y-auto no-scroll">
                {myEnrollments?.data?.map((enr) => (
                    <div
                        key={enr.courseId}
                        className="h-70 bg-linear-to-br from-cyan-100/20 to-cyan-50 dark:bg-linear-to-br dark:from-cyan-800/20 dark:to-cyan-800/20 rounded-lg p-2 flex flex-col"
                    >
                        <div className="flex-1">
                            <h2 className="text-xl font-bold cursor-pointer hover:underline hover:underline-offset-2 h-15">
                                <Link to={`/course/enroll/${enr.courseId}`}>
                                    {enr.course.title}
                                </Link>
                            </h2>
                            <ReadMore
                                text={enr.course.description}
                                maxLen={100}
                                props={cn("mb-3")}
                            />
                            <div className="flex justify-between text-sm">
                                <p>
                                    <span className="font-semibold">
                                        Type:{" "}
                                    </span>
                                    {enr.course.price ? "PAID" : "FREE"}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Price:{" "}
                                    </span>
                                    {enr.course.price
                                        ? `₹${enr.course.price}`
                                        : "₹0"}
                                </p>
                            </div>
                            <div className="flex justify-between text-sm">
                                <p>
                                    <span className="font-semibold">
                                        Added:{" "}
                                    </span>
                                    {timeAgo(enr.course.createdAt)}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Enrolled:{" "}
                                    </span>
                                    {timeAgo(enr.enrolledAt)}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" className={cn("w-full")}>
                            View Course
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
