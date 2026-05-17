import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const HoverInfo = ({ children, content }) => {
    const triggerRef = useRef(null);

    const [show, setShow] = useState(false);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    const updatePosition = () => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();

        setPosition({
            top: rect.bottom + 40,
            left: rect.left + 15,
        });
    };

    useEffect(() => {
        if (!show) return;

        updatePosition();

        window.addEventListener("scroll", updatePosition);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition);
            window.removeEventListener("resize", updatePosition);
        };
    }, [show]);

    return (
        <>
            <div
                ref={triggerRef}
                className="w-fit hidden md:block"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
            </div>

            {show &&
                createPortal(
                    <div
                        className="fixed z-50 rounded-md bg-black/70 dark:bg-white/70 px-3 py-2 text-sm text-white dark:text-black shadow-lg whitespace-nowrap pointer-events-none"
                        style={{
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                        }}
                    >
                        {content}
                    </div>,
                    document.body,
                )}
        </>
    );
};
