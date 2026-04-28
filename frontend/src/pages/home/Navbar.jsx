import { useAuthStore } from "@/stores/useAuthStore";
import { Bell } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    const { authUser } = useAuthStore();

    const [notifcationDiv, setNotificationDiv] = useState(false);

    const [profileDropdown, setProfileDropdown] = useState(false);

    return (
        <div className="relative flex justify-between items-center py-2 px-5 w-full max-w-[80%] mx-auto rounded-full bg-foreground/10">
            {/* Search bar */}
            <div></div>

            {/* Profile picture */}
            <div className="flex justify-center items-center gap-8">
                <div>
                    {/* Notifications icon */}
                    <Bell
                        onClick={() => setNotificationDiv((prev) => !prev)}
                        className="hover:text-foreground/30"
                    />
                    {notifcationDiv && (
                        <div className="absolute border-2 top-15 right-5 h-[150%] w-50 rounded-xl flex items-center justify-center text-muted-foreground">
                            No new notifications
                        </div>
                    )}
                </div>
                <div className="relative">
                    {authUser?.data?.image ? (
                        <img
                            onClick={() => setProfileDropdown((prev) => !prev)}
                            src={authUser?.data?.image}
                        />
                    ) : (
                        <img
                            onClick={() => setProfileDropdown((prev) => !prev)}
                            src={
                                authUser?.image ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.data?.name)}&background=2A9D8F&color=1C1C1C&size=64`
                            }
                            alt="User Avatar"
                            className="object-cover rounded-full h-10 w-10"
                        />
                    )}
                    {profileDropdown && (
                        <div className="absolute top-15 right-5 border-2 flex flex-col justify-between items-start w-max h-max gap-3 rounded-xl bg-foreground text-background p-2">
                            <Link
                                className="w-full rounded-xl p-2 hover:bg-background/20"
                                to={"/view-profile"}
                            >
                                View Profile
                            </Link>
                            <div className="border w-full dark:border-black border-gray-200"></div>
                            <Link
                                className="w-full rounded-xl p-2 hover:bg-background/20"
                                to={"/edit-profile"}
                            >
                                Edit Profile
                            </Link>
                            <div className="border w-full dark:border-black border-gray-200"></div>
                            <Link
                                className="w-full rounded-xl p-2 hover:bg-background/20"
                                to={"/change-password"}
                            >
                                Change Password
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
