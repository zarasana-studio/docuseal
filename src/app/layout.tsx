import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";


const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://docuseal.ai",
  ),
  title: {
    default: "DocuSeal — Free AI Legal Document Generator",
    template: "%s | DocuSeal",
  },
  description:
    "Generate professional legal documents in seconds with AI. Free privacy policies, terms of service, NDAs, contracts, and more. No lawyer needed.",
  keywords: [
    "free privacy policy generator",
    "terms of service generator",
    "NDA generator",
    "free legal document generator",
    "AI contract generator",
    "cookie policy generator",
    "freelancer contract template",
  ],
  authors: [{ name: "DocuSeal" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://docuseal.ai",
    siteName: "DocuSeal",
    title: "DocuSeal — Free AI Legal Document Generator",
    description: "Generate any legal document in 30 seconds. Powered by AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DocuSeal — AI Legal Document Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuSeal — Free AI Legal Document Generator",
    description: "Generate any legal document in 30 seconds. Powered by AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL ?? "https://docuseal.ai",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "DocuSeal",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description:
                "AI-powered legal document generator. Create privacy policies, terms of service, NDAs, contracts, and more in seconds.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free plan available",
              },
              url: process.env.NEXT_PUBLIC_APP_URL ?? "https://docuseal.ai",
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
