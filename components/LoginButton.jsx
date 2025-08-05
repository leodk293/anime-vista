"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import googleLogo from "../public/google-logo.png";
import { signIn, useSession } from "next-auth/react";

import { toast } from "react-toastify";

import { Schibsted_Grotesk } from "next/font/google";

const schibsted_grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: "700",
});

export default function LoginButton() {
  const { data: session, status } = useSession();

  const showWelcomeBackMessage = () => {
    toast.success(`Welcome back ${session?.user?.email}!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showNewUserMessage = () => {
    toast.success(`Welcome ${session?.user?.email}!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  async function checkUserExistence() {
    if (!session?.user?.email) return;

    try {
      const response = await fetch(
        `/api/check-user-exists?email=${encodeURIComponent(session.user.email)}`
      );

      if (!response.ok) {
        throw new Error("Failed to check user existence");
      }

      const data = await response.json();

      if (data.exists) {
        showWelcomeBackMessage();
      } else {
        showNewUserMessage();
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const timer = setTimeout(() => {
        checkUserExistence();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, session]);

  async function handleSignIn() {
    try {
      await signIn("google");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={status === "loading"}
      className="border border-transparent text-gray-950 text-lg bg-gray-100 rounded-full cursor-pointer px-4 py-2 self-center flex flex-row gap-1 justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Image
        src={googleLogo}
        alt="Google"
        width={25}
        height={25}
        className="self-center object-contain"
      />
      <span
        className={`self-center ${schibsted_grotesk.className} font-medium`}
      >
        {status === "loading" ? "Loading..." : "Login"}
      </span>
    </button>
  );
}
