import { Session } from "next-auth";

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
    generatePdf: (summary: string, questions: string, imageBuffer: string, pdfTheme: string, setCachedPdfs: any, setPreviewPdfUrl: any) => void;
    pdfTheme: string; 
    setCachedPdfs: any; 
    setPreviewPdfUrl: any;
}

export interface NavProps {
    name: string;
}

export interface LoginModalProps {
    closeModal: () => void;
    session: Session | null;
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
    generatePdf: (summary: string, questions: string, imageBuffer: string, pdfTheme: string, setCachedPdfs: any, setPreviewPdfUrl: any) => void;
    handleThemeChange: (theme: string) => void;
    pdfTheme: string; 
    setCachedPdfs: any; 
    setPreviewPdfUrl: any;
}

export interface LayoutProps {
    title1: string;
    title2: string;
    subtitle: string;
    imageUrl: string;
    type: number;
}

export interface LoginProps {
    handleLogin: (provider: string) => void;
    setShowSignUp: (show: boolean) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (name: string) => void;
    session: Session | null;
}

export interface SignInProps {
    setShowSignUp: (show: boolean) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (name: string) => void;
    session: Session | null;
}