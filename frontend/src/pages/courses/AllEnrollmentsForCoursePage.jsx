import { useEnrollmentStore } from "@/stores/useEnrollmentStore";
import { ArrowLeft, Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const AllEnrollmentsForCoursePage = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const { getAllEnrollments, isGettingAllEnrollments, allEnrollments } =
        useEnrollmentStore();

    useEffect(() => {
        getAllEnrollments(id);
    }, [id]);

    if (isGettingAllEnrollments) {
        <div className="h-full flex items-center justify-center">
            <Loader className="animate-spin text-foreground" />
        </div>;
    }

    return (
        <div className="relative h-full w-full flex flex-col gap-2">
            <ArrowLeft
                onClick={() => navigate("/")}
                className="hidden md:block absolute cursor-pointer" />
            <h1 className="text-center text-4xl">
                {allEnrollments?.data?.course?.title}
            </h1>
            <div className="w-full flex justify-between items-center text-lg">
                <p>
                    Total Enrollments:{" "}
                    {allEnrollments?.data?.course?.totalEnrollments}
                </p>
                <p>Price: {allEnrollments?.data?.course?.price > 0 ? `₹${allEnrollments?.data?.course?.price}` : "Free"}</p>
            </div>

            <div className="flex-1 border-2 rounded-lg mt-2">
                {allEnrollments?.data?.enrollments?.length > 0 ? (
                    allEnrollments?.data?.enrollments?.map((student) => {
                        return (
                            <div
                                key={student?.user?.id}
                                className="px-4 py-2 border-2 m-4 rounded-xl"
                            >
                                <p className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <span className="text-lg">
                                        Student:{" "}
                                        <span className="font-bold">
                                            {student?.user?.name}
                                        </span>
                                    </span>
                                    <span>
                                        Enrolled At:{" "}
                                        {
                                            new Date(student?.enrolledAt)
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                    </span>
                                </p>
                                <p className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <span>
                                        Completed:{" "}
                                        {student?.completed ? (
                                            <span className="text-green-500">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="text-red-500">
                                                No
                                            </span>
                                        )}
                                    </span>
                                    {student?.completed && (
                                        <span>
                                            Completed At:{" "}
                                            {student?.completedAt ? (
                                                student?.completedAt
                                            ) : (
                                                <span className="text-foreground/50">
                                                    Unavailable
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <div>No enrollments found</div>
                )}
            </div>
        </div>
    );
};
