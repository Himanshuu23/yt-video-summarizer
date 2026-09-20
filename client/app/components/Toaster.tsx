"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toaster() {
  return <ToastContainer theme="dark" position="top-right" autoClose={4000} />;
}
