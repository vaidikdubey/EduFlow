import { useEnrollmentStore } from "@/stores/useEnrollmentStore";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const VerifyCertificatePage = () => {
    const { id } = useParams();

    const { verifyCertificate, isVerifyingCertificate, verifiedCertificate } =
        useEnrollmentStore();

    useEffect(() => {
        verifyCertificate(id);
        //eslint-disable-next-line
    }, [id]);

    const statusMessages = [
        "Connecting to verification service...",
        "Checking certificate details...",
        "Confirming authenticity...",
        "Preparing verification results...",
    ];

    const [currentStatus, setCurrentStatus] = useState(0);

    useEffect(() => {
        // if (!isVerifyingCertificate) return;

        const interval = setInterval(() => {
            setCurrentStatus((prev) => {
                if (prev < statusMessages.length - 1) {
                    return prev + 1;
                }

                return prev;
            });
        }, 2 * 1000);

        return () => clearInterval(interval);
    }, [isVerifyingCertificate]);

    console.log("Verified: ", verifiedCertificate?.data);

    if (!isVerifyingCertificate) {
        return (
            <div className="h-full w-full flex flex-col justify-between items-center">
                <h1 className="text-4xl font-bold underline underline-offset-4">
                    Verifying Certificate
                </h1>
                <p className="text-lg text-center text-wrap max-w-[40%]">
                    We're securely validating the certificate against our
                    official records. This usually takes just a few seconds.
                </p>
                <div className="flex flex-col justify-center items-center gap-5">
                    <Loader
                        className="animate-spin text-foreground"
                        size={100}
                    />
                    <p
                        key={currentStatus}
                        className="text-md text-muted-foreground animate-in fade-in duration-500"
                    >
                        {statusMessages[currentStatus]}
                    </p>
                </div>
                <p className="text-xs text-muted-foreground">
                    Please don't close this page while verification is in
                    progress.
                </p>
            </div>
        );
    }

    return <div>VerifyCertificatePage</div>;
};
