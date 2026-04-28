import React, { useRef } from "react";
import {
    Menu,
    X,
    Cog,
    LogOut,
    User,
    LibraryBig,
    ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const Sidebar = ({ setLatestCoursesPage, setMyEnrollmentsPage }) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    const sideBarRef = useRef(null);

    let tl = useRef(null);

    useGSAP(() => {
        tl.current = gsap.timeline({ paused: true });

        tl.current
            .from(sideBarRef.current, {
                x: "-100%",
                opacity: 0,
                duration: 0.2,
            })
            .to(".sidebar-menu", {
                opacity: 0,
                delay: 0,
                duration: 0,
            })
            .from(".headline", {
                y: -20,
                opacity: 0,
                duration: 0.2,
            })
            .from(".sidebar-items", {
                x: -30,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
            })
            .from(".sidebar-items-bottom", {
                x: -30,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
            })
            .from(".sidebar-close", {
                x: 20,
                opacity: 0,
                duration: 0.2,
            });
    });

    return (
        <>
            <Menu
                className={cn(
                    "sidebar-menu absolute top-3 left-2 hover:text-pink-500",
                )}
                onClick={() => tl.current.play()}
            />

            <div
                ref={sideBarRef}
                className="side-bar fixed z-20 top-0 left-0 h-full w-[70%] md:w-[30%] lg:w-[20%] 2xl:w-[20%] bg-gray-300/90 rounded-md p-3"
            >
                <div className="relative h-full w-full flex flex-col justify-between items-center">
                    <div className="w-full">
                        <div className="flex justify-between">
                            <h1 className="headline text-3xl text-pink-600 cursor-none">
                                EduFlow
                            </h1>
                            <X
                                className="sidebar-close absolute top-2 right-2 hover:text-red-600 dark:text-black dark:hover:text-red-600"
                                onClick={() => tl.current.reverse()}
                            />
                        </div>
                        <div className="h-full w-full flex flex-col gap-4 py-2 dark:text-black">
                            <p
                                className="sidebar-items flex gap-2 hover:bg-gray-500/70 p-2 text-lg rounded-lg cursor-pointer"
                                onClick={() => {
                                    navigate("/course");
                                }}
                            >
                                <LibraryBig /> Courses
                            </p>
                            <p
                                className="sidebar-items flex gap-2 hover:bg-gray-500/70 p-2 text-lg rounded-lg cursor-pointer"
                                onClick={() => {
                                    (setLatestCoursesPage(false),
                                        setMyEnrollmentsPage(true));
                                }}
                            >
                                <ClipboardCheck /> Enrollments
                            </p>

                            <p
                                className="sidebar-items flex gap-2 hover:bg-gray-500/70 p-2 text-lg rounded-lg cursor-pointer"
                                onClick={() => {
                                    navigate("/me");
                                }}
                            >
                                <User /> Profile
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-4 dark:text-black">
                        <div className="sidebar-items-bottom border-b-2 border-gray-700 w-full" />
                        <p
                            className="sidebar-items-bottom flex gap-2 hover:bg-gray-500/70 p-2 rounded-lg text-lg"
                            onClick={() => {
                                navigate("/settings");
                            }}
                        >
                            <Cog /> Settings{" "}
                        </p>
                        <p
                            className="sidebar-items-bottom flex gap-2 hover:bg-red-500/70 p-2 rounded-lg text-lg"
                            onClick={handleLogout}
                        >
                            <LogOut /> Logout{" "}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
