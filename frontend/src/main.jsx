import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./utils/ErrorBoundary";
import CustomCursor from "./utils/CustomCursor";

createRoot(document.getElementById("root")).render(
    <ErrorBoundary>
        <CustomCursor text={"📚"} duration={0.7} />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ErrorBoundary>,
);
