import { cn } from "@/lib/utils";
import { useCourseStore } from "@/stores/useCourseStore";
import { Loader, PlaneTakeoff } from "lucide-react";
import React, { useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { timeAgo } from "@/utils/timeAgo";
import { Button } from "@/components/ui/button";

const DraftCoursesPage = () => {
    const {
        getAllDrafts,
        isGettingDrafts,
        draftCourses,
        publishCourse,
        isPublishingCourse,
        publishedCourse,
    } = useCourseStore();

    useEffect(() => {
        getAllDrafts();
    }, []);

    console.log("Data: ", draftCourses?.data);

    const handleCoursePublish = (id) => {
        publishCourse(id);
    };

    if (isGettingDrafts) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            {draftCourses?.data?.length > 0 ? (
                <div className="border-2 rounded-lg flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-y-auto no-scroll p-5">
                    {draftCourses?.data?.map((course) => {
                        return (
                            <Card key={course.id} className="w-full max-h-fit">
                                <CardHeader>
                                    <CardTitle
                                        className={cn(
                                            "text-2xl cursor-pointer hover:underline hover:text-foreground/80 line-clamp-3 md:line-clamp-2 min-h-10 lg:min-h-15",
                                        )}
                                    >
                                        {course.title}
                                    </CardTitle>
                                    <CardDescription
                                        className={cn("min-h-10 line-clamp-2")}
                                    >
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between my-1">
                                        <p className="text-sm text-foreground/80 font-semibold">
                                            {course.type}
                                        </p>

                                        {course.type === "PAID" && (
                                            <p className="text-sm text-foreground/80 font-semibold">
                                                ₹{course.price}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-row items-center justify-between my-1">
                                        <p className="text-xs text-muted-foreground">
                                            <span className="font-semibold">
                                                Author:
                                            </span>{" "}
                                            {course?.createdBy?.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            <span className="font-semibold">
                                                Added:
                                            </span>{" "}
                                            {timeAgo(course?.createdAt)}
                                        </p>
                                    </div>

                                    <div className="my-1">
                                        <p className="text-xs text-muted-foreground truncate">
                                            <span className="font-semibold">
                                                Instructors:
                                            </span>{" "}
                                            {course?.instructors
                                                ?.map((ins) => ins.name)
                                                .join(", ")}
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col gap-2">
                                    <Button
                                        onClick={() =>
                                            handleCoursePublish(course.id)
                                        }
                                        disable={isPublishingCourse}
                                    >
                                        Publish
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center h-full w-full flex justify-center items-center text-2xl text-muted-foreground border-2 border-dotted rounded-xl">
                    No draft courses found... {<PlaneTakeoff />}
                </div>
            )}
        </div>
    );
};

export default DraftCoursesPage;
