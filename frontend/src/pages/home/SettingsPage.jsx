import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/useAuthStore";
import { Field, FieldLabel } from "@/components/ui/field";

export const SettingsPage = () => {
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
        <div className="h-full w-full flex flex-col justify-center items-center">
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
                        <SwitchDisabled
                            content={
                                authUser?.data?.role === "INSTRUCTOR"
                                    ? "Instructor"
                                    : "Student"
                            }
                            status={
                                authUser?.data?.role === "INSTRUCTOR"
                                    ? true
                                    : false
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export function SwitchDisabled({ content, status }) {
    return (
        <Field
            orientation="horizontal"
            data-disabled
            className="w-full flex justify-between items-center space-x-2"
        >
            <Switch id="switch-disabled-unchecked" checked={status} disabled />
            <FieldLabel htmlFor="switch-disabled-unchecked">
                {content}
            </FieldLabel>
        </Field>
    );
}
