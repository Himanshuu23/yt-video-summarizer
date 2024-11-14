'use client'
import { forwardRef } from "react";

const Demo = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div ref={ref} className="h-screen w100 bg-black">This is the demo section</div>
    )
})

export default Demo