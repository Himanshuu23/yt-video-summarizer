export interface SummaryProps {
    isOpen: boolean;
    closeModal: () => void;
    summary: string;
    questions: string;
    pdfUrl: string | null;
    handleThemeChange: (theme: string) => void;
    selectedLanguage: string;
    setSelectedLanguage: (lang: string) => void;
}