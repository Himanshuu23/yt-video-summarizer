import { Session } from "next-auth";
import { ThemeType } from "./theme";
import { UserDataTypes } from "./user";

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
  loading: boolean;
  imageBuffer?: string;
  pdfUrl: string | null;
  handleThemeChange: (theme: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  generatePdf: (
    summary: string,
    questions: string,
    imageBuffer: string,
    pdfTheme: string,
    setCachedPdfs: (updater: (prev: ThemeType) => ThemeType) => void,
    setPreviewPdfUrl: (url: string) => void
  ) => void;
  pdfTheme: string;
  setCachedPdfs: (updater: (prev: ThemeType) => ThemeType) => void;
  setPreviewPdfUrl: (url: string) => void;
  handleLanguageChange: (language: string) => void;
  selectedFeatures: string[];
}

export interface NavProps {
  name: string;
}

export interface LoginModalProps {
  closeModal: () => void;
  session: Session | null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserData: (user: UserDataTypes) => void;
}

export interface SpeechProps {
  summary: string;
  questions: string;
  selectedLanguage?: string;
  imageSrc?: string | null;
}

export interface PdfOptionsProps {
  summary: string;
  questions: string;
  imageBuffer?: string;
  pdfUrl: string | null;
  generatePdf: (
    summary: string,
    questions: string,
    imageBuffer: string,
    pdfTheme: string,
    setCachedPdfs: (updater: (prev: ThemeType) => ThemeType) => void,
    setPreviewPdfUrl: (url: string) => void
  ) => void;
  handleThemeChange: (theme: string) => void;
  pdfTheme: string;
  setCachedPdfs: (updater: (prev: ThemeType) => ThemeType) => void;
  setPreviewPdfUrl: (url: string) => void;
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
  url?: string | null;
  setUrl?: (url: string) => void;
  fileUrl?: File | null;
  setFileUrl?: (file: File | null) => void;
  setQuestions: (questions: string) => void;
  setResponse: (response: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isModalOpen: boolean;
  setIsModalOpen: (currentState: boolean) => void;
  errorMessage: string;
  setSelectedFeatures: (features: string[]) => void;
  selectedFeatures: string[];
  isSubmitting?: boolean;
}

export interface LoginProps {
  handleLogin: (provider: string) => void;
  setShowSignUp: (show: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (name: string) => void;
  closeModal: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserData: (user: UserDataTypes) => void;
}

export interface SignInProps {
  setShowSignUp: (show: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (name: string) => void;
  session: Session | null;
}
