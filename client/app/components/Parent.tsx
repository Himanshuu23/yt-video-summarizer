'use client'

import React from "react";
import Upload from "./HomePageComponents/Upload";
import Summarize from "./HomePageComponents/Summarize";
import Hero from "./HomePageComponents/Hero";

const HEADING = "One-click and Summarized!"
const BODY = "Turn long lectures and notes into AI-powered summaries in a snap!"
const SUBHEADING1 = "Never-ending video?"
const SUBHEADING2 = "Endless notes?"
const BG = "/giphy.mp4"

export default function Parent() {
    
    return (
        <div className="h-auto w-screen overflow-x-hidden">
            <Hero heading={HEADING} body={BODY} subheading1={SUBHEADING1} subheading2={SUBHEADING2} bg={BG} />
            <Summarize />
            <Upload />
        </div>
    )
}