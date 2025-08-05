"use client";
import React from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="border border-transparent text-lg bg-white/10 text-white rounded-full cursor-pointer px-4 py-2 self-center flex flex-row gap-2 justify-center items-center hover:translate-x-2 duration-200"
    >
      <LogOut
        className="self-center"
        size={25}
        color="#ffffff"
        strokeWidth={1.75}
      />
      <p className="self-center">Log out</p>
    </button>
  );
}
