import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ViewIt | AR Product Showcase",
  description: "Bespoke AR product visualization for digital-first brands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0f1115] text-white">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1d23',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
        </AuthProvider>
        <script 
          type="module" 
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
          defer
        ></script>
      </body>
    </html>
  );
}
