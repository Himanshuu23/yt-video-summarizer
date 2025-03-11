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