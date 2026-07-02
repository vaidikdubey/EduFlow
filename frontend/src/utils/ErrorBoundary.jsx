import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import CustomCursor from "./CustomCursor";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error, errInfo) {
        console.log("Error boundary caught an error: ", error);
        console.error(errInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <>
                    <CustomCursor text={"🐞"} />
                    <div className="h-full w-full flex flex-col justify-center items-center gap-3 cursor-none">
                        <h2 className="text-4xl font-semibold">
                            Well... that's not supposed to happen!
                        </h2>
                        <p className="text-lg">
                            A tiny bug sneaked in where it wasn't invited. We're
                            on it.
                        </p>

                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className={cn(
                                "h-15 w-40 my-5 text-xl font-semibold cursor-none",
                            )}
                        >
                            Reload Page
                        </Button>
                    </div>
                </>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
