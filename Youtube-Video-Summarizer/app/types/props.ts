import { Session } from "next-auth";
import { ThemeType } from "./theme";

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
    imageBuffer?: string;
    pdfUrl: string | null;
    handleThemeChange: (theme: string) => void;
    selectedLanguage: string;
    setSelectedLanguage: (lang: string) => void;
    generatePdf: (summary: string, questions: string, imageBuffer: string, pdfTheme: string, setCachedPdfs: any, setPreviewPdfUrl: any) => void;
    pdfTheme: string;
    setCachedPdfs: (pdfs: ThemeType) => void;
    setPreviewPdfUrl: (url: string) => void;
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
    imageBuffer?: string;
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
    response: string;
    questions: string;
    imageBuffer: string;
    url: string | File | null;
    setQuestions: (questions: string) => void;
    setResponse: (response: string) => void;
    setUrl: (url: any) => void; 
    handleSubmit: (e: any) => void;
    isModalOpen: boolean;
    setIsModalOpen: (currentState: boolean) => void;
    errorMessage: string;
}

export interface LoginProps {
    handleLogin: (provider: string) => void;
    setShowSignUp: (show: boolean) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (name: string) => void;
    session: Session | null;
    closeModal: () => void;
}

export interface SignInProps {
    setShowSignUp: (show: boolean) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (name: string) => void;
    session: Session | null;
}