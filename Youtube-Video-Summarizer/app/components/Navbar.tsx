'use client';

type NavbarProps = {
    demoRef: React.RefObject<HTMLDivElement>;
    heroRef: React.RefObject<HTMLDivElement>;
    pricingRef: React.RefObject<HTMLDivElement>;
};

function scrollToSection(ref: React.RefObject<HTMLDivElement>) {
    if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    }
}

export default function Navbar({ demoRef, heroRef, pricingRef }: NavbarProps) {
    return (
        <nav className="flex justify-between items-center overflow-x-hidden px-6 py-3 bg-black fixed top-0 left-0 w-full z-10">
            <div className="flex items-center">
                <div className="w-10 h-10">Logo</div>
            </div>
            <div className="flex space-x-4 bg-gray-800 rounded-full">
                <button onClick={() => scrollToSection(heroRef)} className="text-white text-sm px-4 py-2 rounded-fullhover:bg-gray-700">Home</button>
                <button onClick={() => scrollToSection(demoRef)} className="text-white text-sm px-4 py-2 rounded-full hover:bg-gray-700">Demo</button>
                <button onClick={() => scrollToSection(pricingRef)} className="text-white text-sm px-4 py-2 rounded-full hover:bg-gray-700">Pricing</button>
                <a href="#" className="text-white text-sm px-4 py-2 rounded-full hover:bg-gray-700">FAQ</a>
                <a href="#" className="flex items-center text-white text-sm px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700">
                    Protection <span className="w-4 h-4 bg-gray-400 rounded-full ml-2"></span>
                </a>
            </div>
            <div>
                <a href="#" className="text-white text-sm px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600">Create Account</a>
            </div>
        </nav>
    );
}
