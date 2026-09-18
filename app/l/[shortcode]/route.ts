import { NextRequest, NextResponse } from "next/server";

import { getLinkBySlug } from "@/data/links";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;

  const link = await getLinkBySlug(shortcode);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  try {
    const destinationUrl = new URL(link.url);

    if (
      destinationUrl.protocol !== "http:" &&
      destinationUrl.protocol !== "https:"
    ) {
      return NextResponse.json(
        { error: "Invalid link destination" },
        { status: 400 }
      );
    }

    return NextResponse.redirect(destinationUrl, { status: 307 });
  } catch {
    return NextResponse.json({ error: "Invalid link destination" }, { status: 400 });
  }
}
