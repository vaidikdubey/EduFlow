import React, { useEffect, useRef, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { ReadMore } from "@/components/ui/ReadMore";
import { useEnrollmentStore } from "@/stores/useEnrollmentStore";
import { salutation } from "../../utils/salutation.js";
import { Navbar } from "./Navbar.jsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sidebar } from "./Sidebar.jsx";

gsap.registerPlugin(ScrollTrigger);

export const HomePage = () => {
    const navigate = useNavigate();

    const { authUser } = useAuthStore();

    const { getAllCourses, isGettingAllCourses, allCourses } = useCourseStore();

    const { getMyEnrollments, isGettingMyEnrollments, myEnrollments } =
        useEnrollmentStore();

    const [latestCoursesPage, setLatestCoursesPage] = useState(true);
    const [myEnrollmentsPage, setMyEnrollmentsPage] = useState(false);

    useEffect(() => {
        getAllCourses();
        getMyEnrollments();
        //eslint-disable-next-line
    }, []);

    const nameRef = useRef(null);
    const courseTabRef = useRef(null);
    const allCoursesRef = useRef(null);

    useGSAP(
        () => {
            if (isGettingAllCourses || isGettingMyEnrollments) return;

            gsap.from(nameRef.current, {
                x: -100,
                opacity: 0,
                duration: 1,
            });

            gsap.from(courseTabRef.current, {
                y: -100,
                opacity: 0,
                duration: 1,
            });
        },
        { dependencies: [isGettingAllCourses, isGettingMyEnrollments] },
    );

    useGSAP(
        () => {
            if (!allCoursesRef.current) return;

            ScrollTrigger.batch(".course-card", {
                scroller: allCoursesRef.current,
                onEnter: (batch) => {
                    gsap.from(batch, {
                        y: 80,
                        opacity: 0,
                        duration: 0.5,
                        stagger: 0.15,
                    });
                },
                onEnterBack: (batch) => {
                    gsap.from(batch, {
                        y: -80,
                        opacity: 0,
                        duration: 0.5,
                        stagger: 0.15,
                    });
                },
                start: "top 90%",
            });
        },
        { dependencies: [allCourses] },
    );

    if (isGettingAllCourses || isGettingMyEnrollments) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <div className="absolute h-[20vw] w-[20vw] max-h-62.5 max-w-62.5 min-h-30 min-w-30 animate-random-corner bg-[oklch(0.8148_0.0819_225.7537/0.25)] dark:bg-[oklch(0.968_0.211_109.7692/0.2)] rounded-full blur-xl z-0"></div>
            <div className="relative w-full h-full flex flex-col justify-center items-center gap-5 bg-transparent z-10">
                <Sidebar
                    setLatestCoursesPage={setLatestCoursesPage}
                    setMyEnrollmentsPage={setMyEnrollmentsPage}
                />
                <div className="w-full p-3 rounded-2xl text-center">
                    <Navbar allCourses={allCourses?.data ?? []} />
                </div>
                <div ref={courseTabRef} className="w-full flex gap-4">
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
                        {myEnrollmentsPage &&
                            `(${myEnrollments?.data?.length})`}
                    </p>
                </div>
                <h1 ref={nameRef} className="text-4xl w-full">
                    {salutation(authUser?.data?.name)}
                </h1>
                <div
                    ref={allCoursesRef}
                    className="h-full w-full grid grid-cols-3 gap-5 overflow-y-auto no-scroll"
                >
                    {latestCoursesPage &&
                        allCourses?.data?.map((course) => (
                            <div
                                key={course.id}
                                className="course-card bg-linear-to-br from-cyan-100/20 to-cyan-50 dark:bg-linear-to-br dark:from-cyan-800/20 dark:to-cyan-800/20 rounded-lg p-2"
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
                                    <HoverCard openDelay={10} closeDelay={100}>
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
                                                            course.instructors
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
                                                {enr.course.price
                                                    ? "PAID"
                                                    : "FREE"}
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
        </div>
    );
};
