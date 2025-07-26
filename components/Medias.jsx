import React from "react";
import { Youtube, Twitter, Facebook, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Medias() {
  return (
    <div className=" flex flex-row gap-3 flex-wrap">
      <Link
        className=" border border-transparent rounded-full p-2 bg-blue-600 hover:bg-blue-700 transition-colors"
        href="https://www.linkedin.com/in/aboubacar-traore-495736252"
        aria-label="Linkedin"
        target="_blank"
      >
        <Linkedin size={25} color="#ffffff" strokeWidth={1.75} />
      </Link>
      <Link
        className=" border border-gray-500 rounded-full p-2 bg-gray-800 hover:bg-gray-900 transition-colors"
        href="https://github.com/leodk293"
        aria-label="GitHub"
        target="_blank"
      >
        <Github size={25} color="#ffffff" strokeWidth={1.75} />
      </Link>
      <Link
        className=" border border-transparent rounded-full p-2 bg-blue-600 hover:bg-blue-700 transition-colors"
        href="https://x.com/Aboubac48530295"
        aria-label="Twitter"
        target="_blank"
      >
        <Twitter size={25} color="#ffffff" strokeWidth={1.75} />
      </Link>
      <Link
        className=" border border-transparent rounded-full p-2 bg-red-600 hover:bg-red-700 transition-colors"
        href="https://www.youtube.com/@aboubacartraore5831"
        aria-label="YouTube"
        target="_blank"
      >
        <Youtube size={25} color="#ffffff" strokeWidth={1.75} />
      </Link>

      <Link
        className=" border border-transparent rounded-full p-2 bg-blue-800 hover:bg-blue-900 transition-colors"
        href="https://www.facebook.com/profile.php?id=100092315485742"
        aria-label="Facebook"
        target="_blank"
      >
        <Facebook size={25} color="#ffffff" strokeWidth={1.75} />
      </Link>
    </div>
  );
}
