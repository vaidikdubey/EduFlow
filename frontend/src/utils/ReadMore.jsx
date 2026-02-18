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
                style={{
                    color: "blue",
                    marginLeft: "5px",
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                }}
            >
                {isExpanded ? "Show Less" : "Show More"}
            </button>
        </p>
    );
};
