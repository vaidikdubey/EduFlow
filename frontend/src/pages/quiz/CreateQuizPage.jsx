import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const CreateQuizPage = () => {
    return (
        <div className="h-full w-full max-w-6xl mx-auto border-l-2 border-r-2 px-5">
            <Input
                placeholder="Enter quiz title"
                className={cn(
                    "placeholder:text-lg placeholder:text-muted-foreground",
                )}
            />
        </div>
    );
};
