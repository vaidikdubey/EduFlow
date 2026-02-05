import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import React from "react";

export const HomePage = () => {
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
            <h1 className="text-2xl text-orange-400">
                Welcome to EduFlow. Page under construction
            </h1>

            <Button variant="destructive" onClick={handleLogout} className={cn("cursor-pointer")}>
                Logout?
            </Button>
        </div>
    );
};
