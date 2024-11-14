'use client';
import { forwardRef } from "react";

const Help = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div ref={ref} className="h-screen w-full bg-red-700">This is the help section</div>
    );
});

export default Help;