import React from "react";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import {
  AnalyticsTracker,
  ErrorBoundaryClient,
  DOMInspector,
  Branding,
} from "@/utils/creatr.scripts";
import { GlobalErrorHandler } from "@/utils/global-error-handler";

// Create a proper React component wrapper
const ErrorBoundaryWrapper: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const ErrorBoundaryComponent =
    ErrorBoundaryClient as unknown as React.ComponentType<any>;
  return <ErrorBoundaryComponent {...props} />;
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "BudgetBuddy - Student Budget Planner",
    template: "%s | BudgetBuddy",
  },
  description: "A simple budget planner for students to track expenses, set budget goals, and visualize spending habits.",
  applicationName: "BudgetBuddy",
  keywords: ["budget", "student", "finance", "expense tracker", "money management", "financial literacy"],
  authors: [{ name: "BudgetBuddy Team" }],
  creator: "BudgetBuddy Team",
  publisher: "BudgetBuddy Team",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BudgetBuddy",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        {" "}
        <GlobalErrorHandler />
        <DOMInspector>
          <ErrorBoundaryWrapper>
            {children}
{/*             <Branding /> */}
          </ErrorBoundaryWrapper>
          <AnalyticsTracker siteKey="${siteKey}" />
        </DOMInspector>
      </body>
    </html>
  );
}
