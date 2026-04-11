import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/useAuthStore";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SettingsPage = () => {
    const navigate = useNavigate();

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [isEnabled, setIsEnabled] = useState(theme === "dark" ? true : false);

    const { authUser } = useAuthStore();

    console.log("authUser", authUser?.data);

    useEffect(() => {
        const root = window.document.documentElement;
        theme === "dark"
            ? root.classList.add("dark")
            : root.classList.remove("dark");

        const favicon = document.querySelector('link[rel="icon"]');

        if (favicon) {
            favicon.href =
                theme === "dark" ? "/favicon.png" : "/favicon-light.png";
        }

        localStorage.setItem("theme", theme);
    }, [theme, isEnabled]);

    const handleThemeChange = (e) => {
        e.preventDefault();

        if (theme === "dark") {
            setIsEnabled(false);
            setTheme("light");
        } else {
            setIsEnabled(true);
            setTheme("dark");
        }
        // setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div className="relative h-full w-full flex flex-col justify-center items-center">
            <Home
                onClick={() => navigate("/")}
                className="absolute top-2 left-2 hidden md:block cursor-pointer"
            />
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className={cn("text-3xl text-center")}>
                        Settings
                    </CardTitle>
                    <CardDescription className={cn("text-center")}>
                        Edit your account settings as per what suits you best
                    </CardDescription>
                </CardHeader>
                <CardContent className={cn("flex flex-col gap-5")}>
                    <div className="flex justify-between items-center space-x-2 px-5">
                        <Switch
                            id="theme-toggle"
                            checked={isEnabled}
                            onClick={(e) => handleThemeChange(e)}
                        />
                        <Label htmlFor="theme-toggle">
                            {isEnabled ? "Dark" : "Light"} Mode
                        </Label>
                    </div>
                    <div className="w-full flex justify-between items-center space-x-2 px-5">
                        <Switch
                            id="role-toggle"
                            checked={
                                authUser?.data?.role === "INSTRUCTOR"
                                    ? true
                                    : false
                            }
                            disabled
                        />
                        <Label>
                            {authUser?.data?.role === "INSTRUCTOR"
                                ? "INSTRUCTOR"
                                : "STUDENT"}
                        </Label>
                    </div>
                    <div className="w-full flex justify-between items-center space-x-2 px-5">
                        <Switch
                            id="admin-toggle"
                            checked={
                                authUser?.data?.role === "ADMIN" ? true : false
                            }
                            disabled
                        />
                        <Label>ADMIN</Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
