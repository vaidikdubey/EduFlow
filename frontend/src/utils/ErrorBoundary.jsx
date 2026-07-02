import React from "react";

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
                <div
                    style={{
                        padding: "2rem",
                        textAlign: "center",
                    }}
                >
                    <h1>Something went wrong.</h1>
                    <p>Please refresh the page.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
