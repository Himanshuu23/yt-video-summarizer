export async function readApiError(response: Response, fallback: string): Promise<string> {
  const raw = await response.text();
  if (!raw) return fallback;
  try {
    const data = JSON.parse(raw) as { error?: string | { message?: string } };
    if (typeof data?.error === "string" && data.error.trim()) return data.error;
    if (data?.error && typeof data.error === "object" && data.error.message) {
      return data.error.message;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

export function toImageSrc(buffer?: string | null): string | null {
  if (!buffer || typeof buffer !== "string") return null;
  if (buffer.startsWith("data:")) return buffer;
  return `data:image/png;base64,${buffer}`;
}
