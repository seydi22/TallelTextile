// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with contact, and login/account links
// *********************

"use client";
import Link from "next/link";
import React from "react";
import { FaHeadphones, FaRegEnvelope } from "react-icons/fa6";

const HeaderTop = () => {
  return (
    <div className="h-10 text-white bg-brand-secondary font-sans max-lg:px-5 max-lg:h-auto max-lg:py-2">
      <div className="flex justify-between h-full items-center max-w-screen-2xl mx-auto px-12 max-lg:flex-col max-lg:gap-2 max-[573px]:px-4">
        <ul className="flex items-center h-full gap-x-5 text-sm">
          <li className="flex items-center gap-x-2">
            <FaHeadphones />
            <span>+222 38 65 12 52</span>
          </li>
          <li className="flex items-center gap-x-2">
            <FaRegEnvelope />
            <span>contact@talleltextile.com</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;
