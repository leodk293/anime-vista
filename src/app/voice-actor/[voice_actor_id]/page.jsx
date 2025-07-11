"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import Image from "next/image";
import Loader from "../../../../components/loader/Loader";

export default function VoiceActorPage({ params }) {
  const resolvedParams = use(params);
  const { voice_actor_id } = resolvedParams;
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="relative max-w-6xl text-white pt-20 pb-12 mx-auto flex flex-col items-center gap-10 justify-center"></div>
    </div>
  );
}
