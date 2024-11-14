'use client'

type NavbarProps = {
    demoRef: React.RefObject<HTMLDivElement>;
    helpRef: React.RefObject<HTMLDivElement>;
    heroRef: React.RefObject<HTMLDivElement>;
    pricingRef: React.RefObject<HTMLDivElement>;
};

function scrollToSection(ref:React.RefObject<HTMLDivElement>) {
    if(ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth' })
    }
}

export default function Navbar({ demoRef, helpRef, heroRef, pricingRef }: NavbarProps) {

    return (
        <nav className="fixed top-0 left-0 w-full z-10 bg-white">
            <ul className="flex justify-between">
                <li>
                    <button onClick={() => scrollToSection(heroRef)}>Homepage Icon</button>
                </li>
                <li>
                    <div >
                        <button onClick={() => scrollToSection(demoRef)}>Demo</button>
                        <button onClick={() => scrollToSection(pricingRef)}>Pricing</button>
                        <button onClick={() => scrollToSection(helpRef)}>Help</button>
                    </div>
                </li>
            </ul>
        </nav>
    )
}