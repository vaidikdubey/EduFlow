import React from "react";
import { useLessonStore } from "@/stores/useLessonStore";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const CreateLesson = () => {
    const { id } = useParams();
    
    const { createLesson, isCreatingLesson, createdLesson } = useLessonStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver()
    })

    return <div>CreateLesson</div>;
};
