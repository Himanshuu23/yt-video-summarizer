export function isYouTubeUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.length > 1;
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      return url.searchParams.has("v") || url.pathname.startsWith("/watch") || url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/live/");
    }
    return false;
  } catch {
    return false;
  }
}
