import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";
import { Outlet } from "react-router-dom";

export const Layout = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        const root = window.document.documentElement;
        theme === "dark"
            ? root.classList.add("dark")
            : root.classList.remove("dark");

        const favicon = document.querySelector('link[rel="icon"]');

        if (favicon) {
            favicon.href =
                theme === "dark" ? "/faviconDark.png" : "/favicon.png";
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleThemeChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div
            className={cn(
                "h-full w-full bg-background text-foreground transition-colors duration-300 p-4",
            )}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeChange}
                className={cn(
                    "absolute right-2 lg:right-8 top-9 hidden md:block",
                )}
                aria-label="Toggle dark mode"
            >
                <Sun
                    className={cn(
                        "h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out absolute inset-0 left-2.5 top-2.5",
                        theme === "dark"
                            ? "-rotate-90 scale-0"
                            : "rotate-0 scale-100",
                    )}
                    aria-label="Light mode"
                />

                <Moon
                    className={cn(
                        "h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out absolute inset-0 left-2.5 top-2.5",
                        theme === "dark"
                            ? "rotate-0 scale-100"
                            : "-rotate-90 scale-0",
                    )}
                    aria-label="Dark mode"
                />
            </Button>
            <Outlet />
        </div>
    );
};
