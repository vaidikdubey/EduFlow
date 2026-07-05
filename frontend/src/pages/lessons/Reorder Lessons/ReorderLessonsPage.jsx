import React, { useEffect, useMemo, useState } from "react";
import { useLessonStore } from "@/stores/useLessonStore";
import { ArrowLeft, Loader, Save } from "lucide-react";
import { useParams } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { SortableLessonCard } from "./SortableLessonCard";

export const ReorderLessonsPage = () => {
    const { id } = useParams();

    const {
        getAllLessons,
        isGettingAllLessons,
        allLessons,
        reorderLessons,
        isReorderingLesson,
    } = useLessonStore();

    const [lessons, setLessons] = useState([]);

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        getAllLessons(id);
        //eslint-disable-next-line
    }, [id]);

    useEffect(() => {
        if (!initialized && allLessons?.data?.lessons) {
            const ordered = allLessons?.data?.lessons.sort(
                (a, b) => a.order - b.order,
            );

            setLessons(ordered);
            setInitialized(true);
        }
    }, [allLessons, initialized]);

    //To check if the user has changed anything or not
    const originalOrder = useMemo(() => {
        return (
            allLessons?.data?.lessons?.map((lesson) => lesson.id).join("-") ||
            ""
        );
    }, [allLessons]);

    const currentOrder = useMemo(() => {
        return lessons.map((lesson) => lesson.id).join("-");
    }, [lessons]);

    const hasUnsavedChanges = originalOrder !== currentOrder;

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;

        const oldIndex = lessons.findIndex((lesson) => lesson.id === active.id);

        const newIndex = lessons.findIndex((lessons) => lessons.id === over.id);

        const reordered = arrayMove(lessons, oldIndex, newIndex).map(
            (lesson, idx) => ({
                ...lesson,
                order: idx + 1,
            }),
        );

        setLessons(reordered);
    };

    const handleSave = async () => {
        const payload = lessons.map((lesson) => ({
            id: lesson.id,
            order: lesson.order,
        }));

        const success = await reorderLessons(id, payload);

        if (success) {
            setInitialized(false);
            getAllLessons(id);
        }
    };

    if (isGettingAllLessons) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col justify-center items-center relative">
            <ArrowLeft
                className="absolute top-0 left-0 hidden md:block cursor-pointer"
                onClick={() => window.history.back()}
            />
            <h1 className="text-xl md:text-4xl font-bold underline underline-offset-2">
                Reorder Lessons
            </h1>
            <p className="hidden md:block w-[60%] text-center">
                Organize the sequence of lessons within this{" "}
                <span className="font-bold underline underline-offset-4">
                    {allLessons?.data?.module?.title}
                </span>{" "}
                module for the course{" "}
                <span className="font-bold underline underline-offset-4">
                    {allLessons?.data?.module?.courseTitle}
                </span>
                . Learners will see lessons in the order shown below.
            </p>
            <p className="text-sm my-1 text-muted-foreground">
                Drag and drop lessons to change their order.
            </p>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={lessons.map((lesson) => lesson.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4 w-full flex-1 border-dashed border-2 rounded-xl px-4 overflow-y-auto no-scroll">
                        {lessons.map((lesson, idx) => (
                            <SortableLessonCard
                                key={lesson.id}
                                lesson={lesson}
                                index={idx}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            <div className="flex justify-end mt-2">
                <Button
                    disabled={!hasUnsavedChanges || isReorderingLesson}
                    onClick={handleSave}
                >
                    {isReorderingLesson ? (
                        <Loader className="mr-2 animate-spin" />
                    ) : (
                        <Save className="mr-2" />
                    )}
                    Save Changes
                </Button>
            </div>
            {!hasUnsavedChanges && (
                <div className="hidden md:block rounded-lg border border-yellow-500 bg-yellow-500/20 p-4 text-center absolute bottom-0 md:right-0 w-full md:w-fit">
                    <p className="text-sm md:text-sm lg:font-medium">
                        You have unsaved changes.
                    </p>

                    <p className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">
                        Click Save Changes to update the lesson order.
                    </p>
                </div>
            )}
        </div>
    );
};
