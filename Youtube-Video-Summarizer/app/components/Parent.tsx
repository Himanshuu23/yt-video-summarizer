'use client'

import { useRef } from "react";
import Navbar from "./Navbar";
import Demo from "./HomePageComponents/Demo";
import Help from "./HomePageComponents/Help";
import Hero from "./HomePageComponents/Hero";
import Pricing from "./HomePageComponents/Pricing";

export default function Parent() {
    const heroRef = useRef<HTMLDivElement>(null)
    const demoRef = useRef<HTMLDivElement>(null)
    const pricingRef = useRef<HTMLDivElement>(null)
    const helpRef = useRef<HTMLDivElement>(null)
    
    return (
        <>
            <Navbar demoRef={demoRef} helpRef={helpRef} heroRef={heroRef} pricingRef={pricingRef} />
            <Hero ref={heroRef} />
            <Demo ref={demoRef} />
            <Pricing ref={pricingRef} />
            <Help ref={helpRef} />
        </>
    )
}