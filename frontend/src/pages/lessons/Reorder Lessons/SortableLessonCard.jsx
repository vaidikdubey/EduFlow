import React from "react";
import { Link } from "react-router-dom";
import { GripVertical, FileText, File, PlayCircle } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableLessonCard = ({ lesson, index }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: lesson.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const getIcon = () => {
        switch (lesson.contentType) {
            case "VIDEO":
                return <PlayCircle className="size-5 text-blue-500" />;

            case "PDF":
                return <File className="size-5 text-red-500" />;

            default:
                return <FileText className="size-5 text-green-500" />;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                w-full flex flex-col md:flex-row justify-between items-center gap-4 px-5 py-3 my-3 rounded-xl border-2 border-l-8 border-pink-400 bg-background transition-all duration-200
                ${
                    isDragging
                        ? "shadow-2xl scale-[1.02] opacity-80"
                        : "hover:shadow-lg"
                }
            `}
        >
            <div className="flex items-center gap-4 w-full">
                <button
                    className="
                        cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground
                    "
                    {...listeners}
                    {...attributes}
                >
                    <GripVertical className="size-5" />
                </button>
                {getIcon()}
                <div>
                    <h6 className="text-xl font-semibold">
                        <span className="text-sm font-normal">
                            {index + 1}.
                        </span>{" "}
                        {lesson.title}
                    </h6>
                    <p className="text-sm">
                        <span className="font-semibold">Type:</span>{" "}
                        {lesson.contentType}
                    </p>
                    {lesson.contentUrl ? (
                        <Link
                            to={lesson.contentUrl}
                            target="_blank"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline underline-offset-2 visited:text-purple-600"
                        >
                            View Content
                        </Link>
                    ) : (
                        <p className="text-xs italic text-muted-foreground">
                            No content URL provided
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="rounded-md bg-muted px-3 py-1 text-sm font-medium">
                    #{lesson.order}
                </div>
            </div>
        </div>
    );
};
