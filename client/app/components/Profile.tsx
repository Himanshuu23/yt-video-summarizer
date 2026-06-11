"use client"

import { useEffect, useRef, useState } from "react"
import { signOut } from "next-auth/react"
import { createPortal } from "react-dom"
import { Poppins } from "next/font/google"
import { capitalizeWords } from "../libs/text"
import { UserDataTypes } from "../types/user"
import { DEV_AVATAR } from "../libs/devUser"
import Cookies from "js-cookie"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
});

const MENU_WIDTH = 180;

export default function Profile({
  userData,
  onLogout,
}: {
  userData: UserDataTypes;
  setUserData?: (data: UserDataTypes) => void;
  onLogout?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const buttonRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  function handleLogout() {
    signOut({ callbackUrl: window.location.origin });
    Cookies.remove("user", { path: "/" });
    onLogout?.();
    setIsOpen(false);
  }

  const openMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      let left = rect.right - MENU_WIDTH
      left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8))

      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left,
        width: MENU_WIDTH,
        zIndex: 9999,
      })
    }
    setIsOpen(true)
  }

  const toggleModal = () => {
    if (isOpen) setIsOpen(false)
    else openMenu()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setIsOpen(false)
    }

    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onResize = () => openMenu()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [isOpen])

  return (
    <>
      <div
        ref={buttonRef}
        className="w-9 h-9 rounded-full border border-white/30 bg-cover bg-center cursor-pointer shrink-0 hover:border-white/60 transition-colors"
        style={{ backgroundImage: `url(${DEV_AVATAR})` }}
        onClick={toggleModal}
        aria-label="Profile menu"
      />

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={`${poppins.className} flex flex-col bg-black border border-white/25 text-white rounded-xl shadow-2xl p-4`}
            style={menuStyle}
          >
            <p className="text-sm mx-1 mb-1 truncate">{capitalizeWords(userData.name)}</p>
            <p className="text-xs text-white/50 mx-1 mb-3">
              <span className="text-white/70">Plan</span> {capitalizeWords(userData.role)}
            </p>
            <button
              onClick={handleLogout}
              className="text-white text-xs px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
              type="button"
            >
              Logout
            </button>
          </div>,
          document.body
        )}
    </>
  )
}
