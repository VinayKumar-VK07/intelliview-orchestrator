import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { ClientProviders } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    default: "AI-Intelliview Orchestrator",
    template: "%s | AI-Intelliview Orchestrator",
  },
  description:
    "Distributed AI-powered interview orchestration dashboard",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} font-sans antialiased bg-bg text-white`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:no-underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-bg"
        >
          Skip to main content
        </a>

        <ClientProviders>
          <div className="flex min-h-screen bg-bg">
            <aside
              aria-label="Primary navigation"
              className="shrink-0"
            >
              <Sidebar />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              <header
                role="banner"
                aria-label="Application header"
              >
                <Topbar />
              </header>

              <main
                id="main-content"
                role="main"
                tabIndex={-1}
                aria-label="Main content"
                className="flex-1 overflow-y-auto p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {children}
              </main>
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}