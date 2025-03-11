import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function Hero() {
    return (
        <section className={`${poppins.className} relative h-screen overflow-x-hidden flex items-center justify-center text-center text-white`}>
          <div className="absolute inset-0">
            <video
              src="/giphy.mp4"
              autoPlay
              loop
              muted
              className="absolute inset-0 w-full h-full object-cover"
            ></video>
            <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>
          </div>
      
          <div className="relative z-10 max-w-4xl px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">One-click and Summarized!</h1>
            <p className="text-base md:text-lg mb-8">Turn long lectures and notes into AI-powered summaries in a snap!</p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
              <a href="#video" className="px-6 py-3 bg-black/40 hover:bg-black/60 rounded-full text-sm">Never-ending video?</a>
              <a href="#notes" className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-full text-sm">Endless notes?</a>
            </div>
          </div>
        </section>
      );
}
