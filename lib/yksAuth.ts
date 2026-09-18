export const YKS_COOKIE = "yks_auth";

export async function makeToken(): Promise<string> {
  const data = new TextEncoder().encode(
    `${process.env.YKS_PASSWORD}:${process.env.YKS_COOKIE_SECRET}`
  );
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}