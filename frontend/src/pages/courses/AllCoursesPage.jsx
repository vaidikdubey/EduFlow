import React, { useEffect } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { Loader, ChevronDown, Search } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export const AllCoursesPage = () => {
    const { isGettingAllCourses, allCourses, getAllCourses } = useCourseStore();

    const { authUser } = useAuthStore();

    useEffect(() => {
        getAllCourses();
    }, []);

    console.log("All courses: ", allCourses);

    if (isGettingAllCourses) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <main className="h-full w-full flex flex-col items-center justify-center px-20">
            {/* <aside></aside> */}

            <div className="flex justify-between items-center w-full self-start -mt-[90vh]">
                <h1 className="flex items-center justify-center gap-2 font-semibold text-2xl">
                    All courses{" "}
                    <ChevronDown className="cursor-pointer" size={18} />{" "}
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
            <div className="w-full">
                <Search />
            </div>
        </main>
    );
};
