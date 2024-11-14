'use client'
import { forwardRef } from "react"

const Pricing = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div ref={ref} className="h-screen w100 bg-green-700">This is the Pricing Section</div>
    )
})

export default Pricing