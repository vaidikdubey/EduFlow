import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export const VerifyEmailPage = () => {
    const { verifyEmail } = useAuthStore();

    const { token } = useParams();

    const navigate = useNavigate();

    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus("error");
                return;
            }

            const result = await verifyEmail(token);
            setStatus(result.status);
        };

        verify();
    }, [token, verifyEmail]);

    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(
                navigate("/", { replace: true }),
                3 * 1000,
            );
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    return (
        <div className="flex h-full items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        {status === "success" && (
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        )}
                        {status === "error" && (
                            <XCircle className="h-12 w-12 text-destructive" />
                        )}
                        {status === "loading" && (
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {status === "success"
                            ? "Email Verified!"
                            : status === "error"
                              ? "Verification Failed"
                              : "Verifying your email"}
                    </CardTitle>
                    <CardDescription>
                        {status === "success"
                            ? "Your account is now fully activated. You can now access all features."
                            : status === "error"
                              ? "The link is invalid or has expired. Please request a new one."
                              : "Please wait while we confirm your credentials..."}
                    </CardDescription>
                </CardHeader>

                <CardFooter className="flex justify-center">
                    <Button asChild className="w-full">
                        <Link to={status === "success" ? "/" : "/signin"}>
                            {status === "success"
                                ? "Go to Dashboard"
                                : "Back to Login"}
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
