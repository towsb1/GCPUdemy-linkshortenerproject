import { auth } from "@clerk/nextjs/server";
import { Link2 } from "lucide-react";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLinksForUser } from "@/data/links";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userLinks = await getLinksForUser(userId);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Your links
        </h1>
        <p className="text-sm text-muted-foreground">
          {userLinks.length === 0
            ? "You haven't created any short links yet."
            : `You have ${userLinks.length} short link${userLinks.length === 1 ? "" : "s"}.`}
        </p>
      </div>

      {userLinks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <Link2 className="size-8 text-muted-foreground" />
            <CardDescription>
              Create your first short link to see it listed here.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {userLinks.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>/{link.slug}</CardTitle>
                  <Badge variant="outline">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <CardDescription className="truncate">
                  {link.url}
                </CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

