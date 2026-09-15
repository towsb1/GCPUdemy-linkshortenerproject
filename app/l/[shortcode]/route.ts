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

  return NextResponse.redirect(new URL(link.url), { status: 307 });
}
