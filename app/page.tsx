import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 bg-zinc-50 font-sans dark:bg-black">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10 px-6 py-16">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground">
            Clerk authentication is ready to wire into your app
          </span>
          <div className="space-y-4">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Ship a polished sign-in flow before you build your first short
              link.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Use the navigation or the actions below to create an account,
              sign in, and confirm your session before you start building link
              management features.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-foreground">
                  Create your first account
                </h3>
                <p className="text-muted-foreground">
                  Sign up or sign in to unlock Clerk-powered authentication
                  for this project.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <SignUpButton mode="modal">
                  <Button size="lg" className="h-11 px-5">
                    Sign up
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="outline" size="lg" className="h-11 px-5">
                    Sign in
                  </Button>
                </SignInButton>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">
              What this setup adds
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <li>Clerk provider configured in the app layout</li>
              <li>Next.js proxy matcher for Clerk requests</li>
              <li>Visible sign-in, sign-up, and user account controls</li>
              <li>shadcn-themed Clerk UI components</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
