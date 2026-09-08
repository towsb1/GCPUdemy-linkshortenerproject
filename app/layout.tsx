import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GCPUdemy Link Shortener",
  description: "Build and manage short links with Clerk authentication.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{ theme: shadcn }} afterSignOutUrl="/">
          <div className="flex min-h-full flex-1 flex-col">
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                    GCPUdemy
                  </p>
                  <h1 className="text-lg font-semibold text-foreground">
                    Link Shortener
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <Button variant="outline" size="lg">
                        Sign in
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="lg">Sign up</Button>
                    </SignUpButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton showName />
                  </Show>
                </div>
              </div>
            </header>
            <main className="flex flex-1">{children}</main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
