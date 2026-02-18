import React, { useState } from "react";

export const ReadMore = ({ text, maxLen = 150 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (text.length <= maxLen) {
        return <p>{text}</p>;
    }

    return (
        <p>
            {isExpanded ? text : `${text.substring(0, maxLen)}...`}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-800 dark:text-blue-400 cursor-pointer text-sm pl-2"
            >
                {isExpanded ? "Show Less" : "Show More"}
            </button>
        </p>
    );
};
