import React, { useEffect, useState } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { Loader, ChevronDown, Search, XCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const AllCoursesPage = () => {
    const { isGettingAllCourses, allCourses, getAllCourses } = useCourseStore();

    const { authUser } = useAuthStore();

    const [searchCourse, setSearchCourse] = useState("");
    const [finalState, setFinalState] = useState("");

    useEffect(() => {
        getAllCourses();
        //eslint-disable-next-line
    }, []);

    const filteredCourse = allCourses?.data?.filter((course) =>
        course.title.toLowerCase().includes(finalState.toLowerCase()),
    );

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setFinalState(searchCourse);
        }
    };

    const clearSearch = () => {
        setSearchCourse("");
        setFinalState("");
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
        <main className="h-full w-full flex flex-col items-center justify-center md:px-10 lg:px-15 overflow-y-auto">
            {/* <aside></aside> */}

            <div className="w-full flex flex-col justify-between items-center self-start mb-5">
                {/* NavBar */}
                <div className="flex justify-between items-center w-full mb-2">
                    <h1 className="flex items-center justify-center gap-2 font-semibold text-2xl">
                        All courses{" "}
                        <ChevronDown
                            className="cursor-pointer"
                            size={18}
                        />{" "}
                    </h1>

                    {authUser?.data?.image ? (
                        <div></div>
                    ) : (
                        <div className="ring-2 ring-amber-500 dark:ring-amber-200 rounded-full cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 40 40"
                            >
                                <circle
                                    cx="20"
                                    cy="20"
                                    r="20"
                                    fill="currentColor"
                                />
                                <circle cx="20" cy="14" r="6" fill="#9ca3af" />
                                <path
                                    d="M10 30c0-5 4-9 10-9s10 4 10 9"
                                    fill="#9ca3af"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="w-full border-2 p-1 px-2 rounded-xl bg-foreground/15 flex items-center justify-center gap-3 relative">
                    <Search />
                    <Input
                        className={cn(
                            "border-0 border-none shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-within:ring-0 hover:border-0 hover:ring-0 focus:border-0 focus-visible:border-0 focus:outline-none focus-visible:outline-none h-full w-full flex items-center justify-center",
                        )}
                        placeholder="Search course..."
                        value={searchCourse}
                        onChange={(e) => setSearchCourse(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    {searchCourse && (
                        <Button variant="ghost" onClick={clearSearch}>
                            <XCircle className="h-4 w-4" />
                        </Button>
                    )}

                    {finalState && (
                        <div
                            className={cn(
                                "absolute top-full left-0 mt-2 w-full bg-popover/70 text-popover-foreground border rounded-md shadow-md z-100 overflow-hidden",
                            )}
                        >
                            <div className={cn("p-2")}>
                                {filteredCourse?.length > 0 ? (
                                    filteredCourse.map((course) => (
                                        <Link
                                            key={course.id}
                                            to={`/course/get/${course.id}`}
                                            className={cn(
                                                "block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm",
                                            )}
                                        >
                                            {course.title}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-muted-foreground">
                                        No matching courses found...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {allCourses?.data?.length > 0 ? (
                <div className="border-2 flex-1 w-full grid grid-cols-3 gap-5 overflow-y-auto no-scroll p-5">
                    {allCourses?.data?.map((course) => (
                        <Card key={course.id} className="w-full max-w-sm">
                            <CardHeader>
                                <CardTitle
                                    className={cn(
                                        "text-2xl cursor-pointer hover:underline hover:text-foreground/80 line-clamp-2 min-h-15",
                                    )}
                                >
                                    {course.title}
                                </CardTitle>
                                <CardDescription
                                    className={cn("min-h-10 line-clamp-2")}
                                >
                                    {course.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-foreground/80 font-semibold">
                                        {course.type}
                                    </p>

                                    {course.type === "PAID" && (
                                        <p className="text-sm text-foreground/80 font-semibold">
                                            ₹{course.price}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p>
                                        Author: {course?.createdBy?.name}
                                    </p>
                                    <p>
                                        Added: {course?.createdAt}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button type="submit" className="w-full">
                                    Enroll
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center h-full w-full flex justify-center items-center text-2xl text-muted-foreground border-2 border-dotted rounded-xl">
                    No courses found...
                </div>
            )}
        </main>
    );
};
