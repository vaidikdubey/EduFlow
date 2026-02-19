import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const ReadMore = ({ text, maxLen = 150, props }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (text.length <= maxLen) {
        return <p>{text}</p>;
    }

    return (
        <p>
            {isExpanded ? text : `${text.substring(0, maxLen)}...`}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "text-blue-800 dark:text-blue-400 cursor-pointer text-sm pl-2",
                    props,
                )}
            >
                {isExpanded ? "Show Less" : "Show More"}
            </button>
        </p>
    );
};
