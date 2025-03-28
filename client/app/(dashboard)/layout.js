'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider/theme-provider"
import { AppSidebar } from "@/components/sidebar/appsidebar";
import { ModeThemeToggle } from "@/components/theme-button";
import LoginCheck from "@/components/login-check";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  LoginCheck()

  return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <SidebarProvider style={{"--sidebar-width": "200px",}}>
          <AppSidebar />
          <SidebarInset>
            <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear border-b-1 border-b-gray-400/40">
              <div className="flex gap-x-2 px-4">
                <SidebarTrigger className="-ml-1" />
              </div>
                <div className="flex gap-x-2 px-4">
                  <ModeThemeToggle />
                </div>
            </header>
            <main className="w-full p-1">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        </ThemeProvider>
  );
}
