import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor({ text }) {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;

        // Center the emoji initially
        gsap.set(cursor, {
            xPercent: -50,
            yPercent: -50,
        });

        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0,
            });
        };

        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-9999 pointer-events-none select-none text-2xl rotate-45"
        >
            {text}
        </div>
    );
}
