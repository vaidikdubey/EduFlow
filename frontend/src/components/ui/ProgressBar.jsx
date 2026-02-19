import React from "react";
import { cn } from "@/lib/utils";

export const ProgressBar = ({ progress, outerProps, innerProps }) => {
    progress = progress > 100 ? 100 : progress;

    return (
        <div
            className={cn(
                "h-full w-50 border-2 rounded-2xl overflow-hidden",
                outerProps,
            )}
        >
            <div
                className={cn(
                    "bg-green-500 text-foreground text-center",
                    innerProps,
                )}
                style={{ width: `${progress}%` }}
            >
                {progress}%
            </div>
        </div>
    );
};
