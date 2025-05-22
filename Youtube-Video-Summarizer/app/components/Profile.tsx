"use client"

import { useEffect, useRef, useState } from "react"
import { signOut } from "next-auth/react"
import { Session } from "next-auth"
import { createPortal } from "react-dom"

export default function Profile({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLDivElement>(null)

  const toggleModal = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX - 80 })
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
        className="w-9 h-9 rounded-full bg-cover bg-center cursor-pointer border-2 border-white"
        style={{ backgroundImage: `url(${session?.user?.image})` }}
        onClick={toggleModal}
      ></div>

      {isOpen &&
        createPortal(
          <div
            className="absolute bg-black text-white rounded-lg shadow-lg p-4 z-[9999] w-36"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              position: "absolute",
            }}
          >
            <p className="text-sm mb-1">{session?.user?.name}</p>
            <p className="text-xs text-gray-300 mb-3">Tokens: 123</p>
            <button
              onClick={() => signOut()}
              className="text-white text-xs px-3 py-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
            >
              Logout
            </button>
          </div>,
          document.body
        )}
    </>
  )
}
