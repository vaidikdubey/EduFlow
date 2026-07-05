import { useModuleStore } from "@/stores/useModuleStore";
import { ArrowLeft, BookOpen, Loader, School, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LessonDialog } from "./LessonDialog";
import { cn } from "@/lib/utils";
import { useLessonStore } from "@/stores/useLessonStore";

export const CreateBulkLessons = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const { getModuleById, isGettingModule, moduleById } = useModuleStore();

    const { createBulkLessons, isCreatingBulkLessons, bulkLessons } =
        useLessonStore();

    const [open, setOpen] = useState(false);

    const [lessons, setLessons] = useState([]);

    const addLesson = (les) => {
        setLessons((prev) => [
            ...prev,
            {
                ...les,
                order: prev.length + 1,
            },
        ]);
    };

    const removeLesson = (idxToRemove) => {
        setLessons((prev) =>
            prev
                .filter((_, idx) => idx !== idxToRemove)
                .map((les, idx) => ({
                    ...les,
                    order: idx + 1,
                })),
        );
    };

    const handleBulkAddition = async () => {
        const success = await createBulkLessons(id, lessons);

        if (success) {
            console.log("Data: ", bulkLessons?.data);
            navigate(`/module/get/${id}`, { replace: true });
        }
    };

    useEffect(() => {
        getModuleById(id);
        //eslint-disable-next-line
    }, [id]);

    if (isGettingModule) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col justify-center items-center relative">
            <ArrowLeft
                onClick={() => window.history.back()}
                className="absolute top-0 left-0 hidden md:block cursor-pointer"
            />
            <h1 className="text-4xl">Create Bulk Lessons</h1>
            <p>Create multiple lessons for Module {moduleById?.data?.title}</p>
            <div className="w-full flex flex-col md:px-8 py-2 px-2 border border-dotted rounded-xl shadow-2xl text-sm">
                <h6 className="font-semibold pb-2">Module Stats</h6>
                <div className="flex justify-between items-center cursor-default flex-wrap">
                    <p className="flex justify-center items-center md:gap-2 text-xs md:text-base">
                        <span className="flex gap-2">
                            <School className="hidden md:block" /> Course:{" "}
                        </span>
                        {moduleById?.data?.course?.title}
                    </p>
                    <p className="flex justify-center items-center md:gap-2 text-xs md:text-base">
                        <span className="flex gap-2">
                            <BookOpen className="hidden md:block" />{" "}
                            Lessons:{" "}
                        </span>
                        {moduleById?.data?._count?.lessons}
                    </p>
                </div>
            </div>
            <div className="h-full w-full flex-1 my-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-25">Lesson Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="max-w-55 truncate">
                                Content URL
                            </TableHead>
                            <TableHead className="text-right">Order</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lessons?.map((lesson, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="font-medium">
                                    {lesson.title}
                                </TableCell>
                                <TableCell>{lesson.contentType}</TableCell>
                                <TableCell>{lesson.contentUrl}</TableCell>
                                <TableCell className="text-right">
                                    {lesson.order}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end">
                                        <Button
                                            variant="outlineDelete"
                                            size="icon"
                                            onClick={() => removeLesson(idx)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4}>Total Lessons</TableCell>
                            <TableCell className="text-right">
                                {lessons?.length}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <div className="w-full text-center mt-4">
                    <Button
                        disabled={isCreatingBulkLessons}
                        onClick={() => setOpen(true)}
                    >
                        Add Lesson
                    </Button>
                    <LessonDialog
                        open={open}
                        setOpen={setOpen}
                        onAddLesson={addLesson}
                    />
                </div>
            </div>
            <Button
                variant="outlineBlur"
                className={cn("font-bold")}
                onClick={handleBulkAddition}
                disabled={isCreatingBulkLessons}
            >
                Commit Lesson Changes
            </Button>
        </div>
    );
};
