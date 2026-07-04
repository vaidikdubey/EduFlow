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
        if (!isVerifyingCertificate) return;

        const interval = setInterval(() => {
            setCurrentStatus((prev) => {
                if (prev < statusMessages.length - 1) {
                    return prev + 1;
                }

                return prev;
            });
        }, 2 * 1000);

        return () => clearInterval(interval);
        //eslint-disable-next-line
    }, [isVerifyingCertificate]);

    if (isVerifyingCertificate) {
        return (
            <div className="h-full w-full flex flex-col justify-between items-center text-center">
                <h1 className="text-4xl font-bold underline underline-offset-4">
                    Verifying Certificate
                </h1>
                <p className="text-md lg:text-xl text-center text-wrap lg:max-w-[40%]">
                    We're securely validating the certificate against our
                    official records. This usually takes just a few seconds.
                </p>
                <Loader className="animate-spin text-foreground" size={100} />
                <p
                    key={currentStatus}
                    className="text-sm md:text-lg text-muted-foreground animate-in fade-in duration-500"
                >
                    {statusMessages[currentStatus]}
                </p>
                <p className="text-xs text-muted-foreground">
                    Please don't close this page while verification is in
                    progress.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full max-w-full md:max-w-[40%] mx-auto flex flex-col justify-center items-center border-dashed border-2 rounded-lg text-center gap-5 lg:gap-10 px-5">
            <h1 className="text-xl lg:text-4xl font-bold underline underline-offset-4">
                Certificate Verified
            </h1>
            <p className="text-[10px] lg:text-sm">
                This certificate has been successfully verified against our
                official records. The information below matches the certificate
                issued by our platform and confirms its authenticity.
            </p>
            <div className="flex flex-col">
                <h3 className="text-lg lg:text-2xl font-semibold underline underline-offset-2 mb-2">
                    Certificate Details
                </h3>
                <p className="text-sm lg:text-base">
                    <span className="lg:text-lg italic">Recipient:</span>{" "}
                    {verifiedCertificate?.data?.studentName}
                </p>
                <p className="text-sm lg:text-base">
                    <span className="lg:text-lg italic">Course:</span>{" "}
                    {verifiedCertificate?.data?.courseTitle}
                </p>
                <p className="text-sm lg:text-base">
                    <span className="lg:text-lg italic">Certificate ID:</span>{" "}
                    <span className="font-bold">
                        {verifiedCertificate?.data?.certificateId}
                    </span>
                </p>
                <p className="text-sm lg:text-base">
                    <span className="lg:text-lg italic">Issued At: </span>
                    {verifiedCertificate?.data?.issuedAt &&
                        new Date(verifiedCertificate?.data?.issuedAt)
                            .toISOString()
                            .split("T")[0]}
                </p>
            </div>
            <p className="text-2xl font-bold italic">
                Certificate Status:{" "}
                {verifiedCertificate?.data?.valid ? "Valid ✅" : "Invalid ❌"}
            </p>
            <img
                src={
                    verifiedCertificate?.data?.valid
                        ? "/verified-badge.png"
                        : "/unverified-badge.png"
                }
                alt="Verified Certificate"
                className="w-25 lg:w-40 h-auto mt-6 object-contain"
            />
        </div>
    );
};
