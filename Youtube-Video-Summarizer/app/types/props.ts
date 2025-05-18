export interface HeroProps {
    heading: string;
    body: string;
    subheading1: string;
    subheading2: string;
    bg: string;
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
    name: string;
}

export interface LoginModalProps {
    closeModal: () => void;
}

export interface SpeechProps {
    summary: string;
    questions: string;
    selectedLanguage?: string;
}

export interface PdfOptionsProps {
    summary: string;
    questions: string;
    imageBuffer: string;
    pdfUrl: string | null;
    generatePdf: (summary: string, questions: string, pdfUrl: string) => void;
    handleThemeChange: (theme: string) => void;
}