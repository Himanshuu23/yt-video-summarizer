"use client"

import React from 'react';
import { useState } from 'react';

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <div>
      <button
        onClick={openModal}
        className="mt-8 w-full block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
      >
        Get started today
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-black bg-opacity-75 p-8 rounded-xl w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute p-2 top-1 right-2 text-white text-2xl">
              &times;
            </button>
            <p>Due to unforeseen circumstances, the payment gateway is temporarily unavailable. We're working to resolve this as soon as possible. Thank you for your understanding! 🙏</p>
          </div>
        </div>
      )}
    </div>
  );
}
