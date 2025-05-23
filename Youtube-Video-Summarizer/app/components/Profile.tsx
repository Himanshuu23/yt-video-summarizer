"use client"

import { useEffect, useRef, useState } from "react"
import { signOut } from "next-auth/react"
import { Session } from "next-auth"
import { createPortal } from "react-dom"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function Profile({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLDivElement>(null)

  const toggleModal = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX - 90 })
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <>
      <div
  ref={buttonRef}
  className="w-9 h-9 rounded-full border-2 border-white/50 bg-cover bg-center cursor-pointer flex items-center justify-center text-white font-semibold text-sm"
  style={
    session?.user?.image
      ? { backgroundImage: `url(${session.user.image})` }
      : {}
  }
  onClick={toggleModal}
>
  {!session?.user?.image &&
    `${session?.user?.name?.split(" ")[0][0] ?? ""}${session?.user?.name?.split(" ").slice(-1)[0][0] ?? ""}`}
</div>

      {isOpen &&
        createPortal(
          <div
            className={`${poppins.className} absolute flex flex-col backdrop-blur-md bg-black/35 text-white rounded-lg shadow-lg p-4 z-[9999] w-42`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              position: "absolute",
            }}
          >
            <p className="text-sm mb-1">{session?.user?.name}</p>
            <p className="text-sm text-gray-300 mx-2 mb-3"><b>Current Plan</b> Premium</p>
            <button
              onClick={() => signOut()}
              className="text-white text-xs px-2 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
            >
              Logout
            </button>
          </div>,
          document.body
        )}
    </>
  )
}
