import { cn } from "@/lib/utils";
import { useCourseStore } from "@/stores/useCourseStore";
import { ArrowLeft, Loader, PlaneTakeoff } from "lucide-react";
import React, { useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { timeAgo } from "@/utils/timeAgo";
import { Button } from "@/components/ui/button";
import { ReadMore } from "../../components/ui/ReadMore";

const DraftCoursesPage = () => {
    const {
        getAllDrafts,
        isGettingDrafts,
        draftCourses,
        publishCourse,
        isPublishingCourse,
    } = useCourseStore();

    useEffect(() => {
        getAllDrafts();
    }, []);

    const handleCoursePublish = (id) => {
        publishCourse(id, { isPublished: true });
    };

    if (isGettingDrafts) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-foreground" />
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col gap-5 relative">
            <ArrowLeft
                onClick={() => window.history.back()}
                className="absolute top-5 left-5 cursor-pointer"
            />
            <div className="flex flex-col justify-center items-center gap-2">
                <h1 className="text-4xl font-bold">Draft Courses</h1>
                <p className="text-xl">
                    All your unpublished, draft courses here
                </p>
            </div>
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
                                    {/* <CardDescription
                                        className={cn("min-h-10 line-clamp-2")}
                                    >
                                    </CardDescription> */}
                                    <ReadMore
                                        text={course.description}
                                        maxLen={50}
                                        props={cn("mb-3")}
                                    />
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
                                    <div className="flex justify-center items-center">
                                        <HoverCard
                                            openDelay={10}
                                            closeDelay={100}
                                        >
                                            <HoverCardTrigger asChild>
                                                <Button variant="hover">
                                                    View Instructors
                                                </Button>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="flex gap-2 h-fit w-fit">
                                                {course.instructors.map(
                                                    (ins, idx) => (
                                                        <span key={ins.id}>
                                                            {ins.name}{" "}
                                                            {idx !==
                                                                course
                                                                    .instructors
                                                                    .length -
                                                                    1 && ", "}
                                                        </span>
                                                    ),
                                                )}
                                            </HoverCardContent>
                                        </HoverCard>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleCoursePublish(course.id)
                                        }
                                        disabled={isPublishingCourse}
                                        className={cn("w-full")}
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
