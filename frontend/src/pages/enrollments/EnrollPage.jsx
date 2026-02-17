import React, { useEffect, useState } from "react";
import { useCourseStore } from "@/stores/useCourseStore";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";

export const EnrollPage = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const { checkEnrollment } = useCourseStore();

    const [checkingEnrollment, setCheckingEnrollment] = useState(false);

    useEffect(() => {
        async function enrollment() {
            setCheckingEnrollment(true);

            const status = await checkEnrollment(id);

            if (status) {
                setCheckingEnrollment(false);
                navigate(`/course/get/${id}`);
            } else {
                setCheckingEnrollment(false);
            }
        }

        enrollment();
    }, []);

    if (checkingEnrollment) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-pink-500" />
            </div>
        );
    }

    return <div>EnrollPage</div>;
};
