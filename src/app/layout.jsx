import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "../../Providers";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s | AnimeVista",
    default: "AnimeVista",
  },
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <NextAuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 mx-auto antialiased `}
        >
          <Header />
          <div className=" mx-auto px-3 md:px-0 ">{children}</div>
          <Footer />
          <ToastContainer />
        </body>
      </html>
    </NextAuthProvider>
  );
}
