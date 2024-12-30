'use client'

import { useRef } from "react";
import Navbar from "./Navbar";
import Upload from "./HomePageComponents/Upload";
import Pricing from "./HomePageComponents/Pricing";
import Summarize from "./HomePageComponents/Summarize";
import Hero from "./HomePageComponents/Hero";

export default function Parent() {
    const heroRef = useRef<HTMLDivElement>(null)
    const demoRef = useRef<HTMLDivElement>(null)
    const pricingRef = useRef<HTMLDivElement>(null)
    
    return (
        <div className="h-400vh w-screen overflow-x-hidden">
            <Navbar demoRef={demoRef} heroRef={heroRef} pricingRef={pricingRef} />
            <Hero />
            <Summarize />
            <Upload ref={demoRef} />
            <Pricing ref={pricingRef} />
        </div>
    )
}