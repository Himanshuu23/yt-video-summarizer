export interface HeroProps {
    heading: string,
    body: string,
    subheading1: string,
    subheading2: string,
    bg: string,
}

export interface SummaryProps {
    isOpen: boolean;
    closeModal: () => void;
    summary: string;
    questions: string;
    imageBuffer: string;
    pdfUrl: string | null;
    handleThemeChange: (theme: string) => void;
    selectedLanguage: string;
    setSelectedLanguage: (lang: string) => void;
    generatePdf: (summary: string, questions: string, imageBuffer: string) => void;
}

export interface NavProps {
    name: string
}