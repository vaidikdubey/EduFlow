import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

export const CreateQuizPage = () => {
    const [data, setData] = useState({ title: "", questions: [] });
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

    const handleTitleChange = (e) => {
        setData((prev) => ({
            title: e.target.value,
            questions: [...prev.questions],
        }));
    };

    return (
        <div className="h-full w-full max-w-6xl mx-auto border-l-2 border-r-2 px-5">
            <Input
                placeholder="Enter quiz title"
                className={cn(
                    "mb-5 placeholder:text-lg placeholder:text-muted-foreground placeholder:p-2",
                )}
                onChange={(e) => handleTitleChange(e)}
                value={data.title}
            />
            <div className="h-full w-full border-dashed flex flex-col items-center">
                <Button
                    onClick={() => setIsPublishDialogOpen(true)}
                    className={cn("cursor-pointer hover:shadow-2xl")}
                >
                    <Plus /> Add Question
                </Button>
            </div>
        </div>
    );
};
