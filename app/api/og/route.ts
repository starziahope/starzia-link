import { NextRequest, NextResponse } from "next/server";

const PRIVATE_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
  /^::1$/,
];

function isBlockedHostname(hostname: string) {
  return PRIVATE_HOSTNAME_PATTERNS.some((pattern) => pattern.test(hostname));
}

function extractMetaContent(html: string, property: string) {
  const tagRegex = new RegExp(
    `<meta[^>]*(?:property|name)=["']${property}["'][^>]*>`,
    "i"
  );
  const tag = html.match(tagRegex)?.[0];
  if (!tag) return undefined;
  return tag.match(/content=["']([^"']*)["']/i)?.[1];
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json({ error: "invalid protocol" }, { status: 400 });
  }
  if (isBlockedHostname(target.hostname)) {
    return NextResponse.json({ error: "invalid host" }, { status: 400 });
  }

  try {
    const res = await fetch(target.toString(), {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OnbiteLinkBot/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();

    const rawTitle =
      extractMetaContent(html, "og:title") ??
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    const rawDescription = extractMetaContent(html, "og:description");
    const rawImage = extractMetaContent(html, "og:image");

    const title = rawTitle ? decodeEntities(rawTitle.trim()) : target.hostname;
    const description = rawDescription
      ? decodeEntities(rawDescription.trim())
      : undefined;
    const thumbnail = rawImage
      ? new URL(decodeEntities(rawImage.trim()), target).toString()
      : undefined;

    return NextResponse.json({
      title,
      description,
      thumbnail,
      url: target.toString(),
    });
  } catch {
    return NextResponse.json(
      { error: "failed to fetch open graph data" },
      { status: 502 }
    );
  }
}
