"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import googleLogo from "../public/google-logo.png";
import Logo from "./logo/Logo";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function Header() {
  const { status, data: session } = useSession();
  return (
    <div className=" bg-[#151f2e] w-full">
      <header className=" flex flex-wrap mx-auto py-5 max-w-5xl justify-center gap-5 md:justify-between md:gap-0">
        <Logo />
        <nav className=" self-center flex flex-row gap-10 text-lg font-medium text-gray-200">
          <Link href={""}>Youtube</Link>
          <Link href={""}>Twitter/X</Link>
          <Link href={""}>Facebook</Link>
        </nav>
        {status === "unauthenticated" ? (
          <button
            onClick={() => signIn("google")}
            className=" border border-transparent text-lg bg-gray-100 rounded-full cursor-pointer px-4 py-2 self-center flex flex-row gap-1 justify-center items-center"
          >
            <Image
              src={googleLogo}
              alt="Google"
              width={25}
              height={25}
              className=" self-center object-contain"
            />
            <span className=" self-center font-medium">Sign in</span>
          </button>
        ) : (
          <div className=" flex flx-row gap-2">
            {session?.user && (
              <div className=" border border-gray-300 rounded-full px-3 py-1 flex flex-row gap-2">
                <Image
                  src={session?.user?.image}
                  alt={session?.user?.name}
                  width={30}
                  height={30}
                  className=" self-center rounded-full object-cover"
                />
                <p className=" text-white self-center">
                  {session?.user?.name?.split(" ")[0]}
                </p>
              </div>
            )}

            <button
              onClick={() => signOut()}
              className=" border border-transparent text-lg bg-blue-950 text-white rounded-full cursor-pointer px-4 py-2 self-center flex flex-row gap-2 justify-center items-center"
            >
              <LogOut
                className=" self-center"
                size={25}
                color="#ffffff"
                strokeWidth={1.75}
              />
              <p className=" self-center">Sign out</p>
            </button>
          </div>
        )}
      </header>
    </div>
  );
}
