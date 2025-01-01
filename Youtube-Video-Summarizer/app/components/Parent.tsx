'use client'

import Navbar from "./Navbar";
import Upload from "./HomePageComponents/Upload";
import Summarize from "./HomePageComponents/Summarize";
import Hero from "./HomePageComponents/Hero";

export default function Parent() {
    
    return (
        <div className="h-400vh w-screen overflow-x-hidden">
            <Hero />
            <Summarize />
            <Upload />
        </div>
    )
}