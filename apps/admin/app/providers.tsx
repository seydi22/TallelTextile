"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AdminSession } from "../utils/adminAuth";
import SessionTimeout from "../components/SessionTimeout";

export default function Providers({ 
  children, 
  session 
}: { 
  children: ReactNode; 
  session: AdminSession | null;
}) {
  return (
    <>
      <Toaster position="top-right" />
      <SessionTimeout />
      {children}
    </>
  );
}
