const CLOUD_URL = process.env.HUITL_CLOUD_URL || "https://huitl-cloud.vercel.app";
const API_KEY = process.env.HUITL_API_KEY || "";

export async function huitlApi(path: string, options: RequestInit = {}) {
  const resp = await fetch(`${CLOUD_URL}/api${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error((data as any).error || `API error: ${resp.status}`);
  return data;
}
