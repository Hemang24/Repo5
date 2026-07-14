/**
 * Thin wrapper around the Firecrawl API.
 * Set FIRECRAWL_API_KEY in your environment before calling these functions.
 */

const BASE_URL = "https://api.firecrawl.dev/v1";

function headers() {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) throw new Error("FIRECRAWL_API_KEY environment variable is not set");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };
}

export async function scrapeUrl(url, options = {}) {
  const res = await fetch(`${BASE_URL}/scrape`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ url, formats: ["markdown"], ...options }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Firecrawl scrape failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.data;
}

export async function crawlUrl(url, options = {}) {
  const res = await fetch(`${BASE_URL}/crawl`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ url, limit: 5, ...options }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Firecrawl crawl failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data;
}

export async function searchWeb(query, options = {}) {
  const res = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ query, limit: 5, ...options }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Firecrawl search failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.data;
}
