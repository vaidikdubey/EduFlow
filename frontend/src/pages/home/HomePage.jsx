import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCourseStore } from "@/stores/useCourseStore";
import { timeAgo } from "@/utils/timeAgo";
import {
    Loader,
    Menu,
    X,
    Cog,
    LogOut,
    User,
    LibraryBig,
    ClipboardCheck,
} from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Link, useNavigate } from "react-router-dom";
import { ReadMore } from "@/components/ui/ReadMore";
import { useEnrollmentStore } from "@/stores/useEnrollmentStore";

export const HomePage = () => {
    const navigate = useNavigate();

    const { logout } = useAuthStore();

    const { getAllCourses, isGettingAllCourses, allCourses } = useCourseStore();

    const { getMyEnrollments, isGettingMyEnrollments, myEnrollments } =
        useEnrollmentStore();

    const [latestCoursesPage, setLatestCoursesPage] = useState(true);
    const [myEnrollmentsPage, setMyEnrollmentsPage] = useState(false);
    const [sideBar, setSideBar] = useState(false);

    useEffect(() => {
        getAllCourses();
        getMyEnrollments();
        //eslint-disable-next-line
    }, []);

    const handleLogout = () => {
        logout();
    };

    console.log("My enrollments: ", myEnrollments?.data);

    if (isGettingAllCourses || isGettingMyEnrollments) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full flex flex-col justify-center items-center gap-5">
            <Menu
                className={cn(
                    sideBar && "hidden",
                    "absolute top-3 left-2 hover:text-pink-500",
                )}
                onClick={() => setSideBar(true)}
            />

            {sideBar && (
                <div className="absolute z-20 top-0 left-0 h-full w-[70%] md:w-[30%] lg:w-[25%] 2xl:w-[10%] bg-gray-300/90 rounded-md p-3">
                    <div className="relative h-full w-full flex flex-col justify-between items-center">
                        <div className="w-full">
                            <div className="flex justify-between">
                                <h1 className="text-3xl xl:text-5xl text-pink-600 cursor-none">
                                    EduFlow
                                </h1>
                                <X
                                    className="absolute top-2 right-2 hover:text-red-600"
                                    onClick={() => setSideBar(false)}
                                />
                            </div>
                            <div className="h-full w-full flex flex-col gap-4 py-2">
                                <p
                                    className="flex gap-2 hover:bg-gray-500/70 p-2 text-lg xl:text-2xl rounded-lg cursor-pointer"
                                    onClick={() => {
                                        setSideBar(false);
                                        navigate("/course");
                                    }}
                                >
                                    <LibraryBig
                                        className="hidden xl:block"
                                        size={30}
                                    />{" "}
                                    <LibraryBig className="block xl:hidden" />
                                    Courses
                                </p>
                                <p
                                    className="flex gap-2 hover:bg-gray-500/70 p-2 text-lg xl:text-2xl rounded-lg cursor-pointer"
                                    onClick={() => {
                                        setSideBar(false);
                                        (setLatestCoursesPage(false),
                                            setMyEnrollmentsPage(true));
                                    }}
                                >
                                    <ClipboardCheck
                                        className="hidden xl:block"
                                        size={30}
                                    />
                                    <ClipboardCheck className="block xl:hidden" />{" "}
                                    Enrollments
                                </p>

                                <p
                                    className="flex gap-2 hover:bg-gray-500/70 p-2 text-lg xl:text-2xl rounded-lg cursor-pointer"
                                    onClick={() => {
                                        setSideBar(false);
                                        navigate("/me");
                                    }}
                                >
                                    <User
                                        className="hidden xl:block"
                                        size={30}
                                    />
                                    <User className="block xl:hidden" /> Profile
                                </p>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-4">
                            <div className="border-b-2 border-gray-700 w-full" />
                            <p
                                className="flex gap-2 hover:bg-gray-500/70 p-2 rounded-lg text-lg xl:text-2xl"
                                onClick={() => {
                                    setSideBar(false);
                                    navigate("/settings");
                                }}
                            >
                                <Cog className="xl:block hidden" size={30} />
                                <Cog className="block xl:hidden" />{" "}
                                Settings{" "}
                            </p>
                            <p
                                className="flex gap-2 hover:bg-red-500/70 p-2 rounded-lg text-lg xl:text-2xl"
                                onClick={handleLogout}
                            >
                                <LogOut className="xl:block hidden" size={30} />
                                <LogOut className="block xl:hidden" />{" "}
                                Logout{" "}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full bg-amber-300 p-3 rounded-2xl text-center">
                Navbar comes here
            </div>
            <div className="w-full flex gap-4">
                <p
                    onClick={() => {
                        (setLatestCoursesPage(true),
                            setMyEnrollmentsPage(false));
                    }}
                    className={cn(
                        "cursor-pointer",
                        latestCoursesPage &&
                            "font-bold underline underline-offset-2 text-pink-500",
                    )}
                >
                    All Courses
                </p>
                <p
                    onClick={() => {
                        (setLatestCoursesPage(false),
                            setMyEnrollmentsPage(true));
                    }}
                    className={cn(
                        "cursor-pointer",
                        myEnrollmentsPage &&
                            "font-bold underline underline-offset-2 text-pink-500",
                    )}
                >
                    My Enrollments{" "}
                    {myEnrollmentsPage && `(${myEnrollments?.data?.length})`}
                </p>
            </div>
            <div className="h-full w-full grid grid-cols-3 gap-5 overflow-y-auto no-scroll">
                {latestCoursesPage &&
                    allCourses?.data?.map((course) => (
                        <div
                            key={course.id}
                            className="bg-linear-to-br from-cyan-100/20 to-cyan-50 dark:bg-linear-to-br dark:from-cyan-800/20 dark:to-cyan-800/20 rounded-lg p-2"
                        >
                            <h2 className="text-xl font-bold cursor-pointer hover:underline hover:underline-offset-2 h-15">
                                <Link to={`/course/enroll/${course.id}`}>
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
                                    {course.price ? `₹${course.price}` : "₹0"}
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
                                <HoverCard openDelay={10} closeDelay={100}>
                                    <HoverCardTrigger asChild>
                                        <Button variant="hover">
                                            View Instructors
                                        </Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="flex gap-2 h-fit w-fit">
                                        {course.instructors.map((ins, idx) => (
                                            <span>
                                                {ins.name}{" "}
                                                {idx !==
                                                    course.instructors.length -
                                                        1 && ", "}
                                            </span>
                                        ))}
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                            <Button
                                variant="default"
                                className={cn("w-full cursor-pointer")}
                                onClick={() =>
                                    navigate(`/course/enroll/${course.id}`)
                                }
                            >
                                Enroll
                            </Button>
                        </div>
                    ))}
                {myEnrollmentsPage &&
                    myEnrollments?.data?.map(
                        (enr, idx) =>
                            idx < 6 && (
                                <div
                                    key={enr.courseId}
                                    className="h-fit bg-linear-to-br from-cyan-100/20 to-cyan-50 dark:bg-linear-to-br dark:from-cyan-800/20 dark:to-cyan-800/20 rounded-lg p-2"
                                >
                                    <h2 className="text-xl font-bold cursor-pointer hover:underline hover:underline-offset-2 h-15">
                                        <Link
                                            to={`/course/enroll/${
                                                enr.courseId
                                            }`}
                                        >
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
                                    <Button
                                        variant="default"
                                        className={cn("w-full")}
                                    >
                                        View Course
                                    </Button>
                                </div>
                            ),
                    )}
            </div>
        </div>
    );
};
