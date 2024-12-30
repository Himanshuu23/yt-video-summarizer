import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative h-screen overflow-x-hidden flex items-center justify-center text-center text-white">
            <div className="absolute inset-0">
            <Image
                    src="/hero.jpg"
                    alt="Background Image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
                <div className="absolute inset-0 backdrop-blur-md bg-black/50"></div>
            </div>

            <div className="relative z-10 max-w-4xl px-4">
                <h1 className="text-5xl font-bold mb-4">One-click and Summarized!</h1>
                <p className="text-lg mb-8">Dive into the art assets, where innovative blockchain technology meets financial expertise.</p>
                <div className="flex space-x-4 justify-center">
                    <a href="#" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full text-sm">Open App</a>
                    <a href="#" className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-full text-sm">Discover More</a>
                </div>
            </div>
        </section>
    );
}
