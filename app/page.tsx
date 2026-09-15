import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Link2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Link2,
    title: "Custom short links",
    description:
      "Turn long, unwieldy URLs into short, branded links you can share anywhere in seconds.",
  },
  {
    icon: BarChart3,
    title: "Click analytics",
    description:
      "Track clicks, referrers, and trends over time so you know exactly how your links perform.",
  },
  {
    icon: QrCode,
    title: "QR codes",
    description:
      "Generate a scannable QR code for every short link, perfect for print and in-person sharing.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "Every account is protected with Clerk authentication, so only you manage your links.",
  },
  {
    icon: Zap,
    title: "Instant redirects",
    description:
      "Short links resolve fast, keeping the experience seamless for everyone who clicks.",
  },
  {
    icon: Sparkles,
    title: "Simple dashboard",
    description:
      "Create, edit, and organize all your short links from one clean, unified dashboard.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 bg-zinc-50 font-sans dark:bg-black">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
        <div className="flex flex-col items-start gap-6 text-left">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            Shorten. Share. Track.
          </Badge>
          <div className="space-y-4">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              The simplest way to shorten, share, and track your links.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Create branded short links, generate QR codes, and see how they
              perform — all from a single, secure dashboard.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SignUpButton mode="modal">
              <Button size="lg" className="h-11 px-5">
                Get started free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg" className="h-11 px-5">
                Sign in
              </Button>
            </SignInButton>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-2">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="mt-3 text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
