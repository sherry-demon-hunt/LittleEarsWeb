import { mkdir, writeFile } from "node:fs/promises";

const SHOW_ID = "033nX1b2ppBSHqZsId9qQK";
const MARKET = process.env.SPOTIFY_MARKET || "AU";
const LIMIT = Number(process.env.SPOTIFY_EPISODE_LIMIT || 5);
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SHOW_URL = `https://open.spotify.com/show/${SHOW_ID}`;

function releaseDateToComparableDate(value) {
  if (!value) return null;
  if (/^\d{4}$/.test(value)) return new Date(Date.UTC(Number(value), 11, 31, 23, 59, 59));
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month, 0, 23, 59, 59));
  }
  if (value.includes("T")) return new Date(value);
  return new Date(`${value}T23:59:59Z`);
}

function isPublishedPublicly(episode) {
  const spotifyUrl = episode.external_urls?.spotify;
  const releaseDate = releaseDateToComparableDate(episode.release_date);
  const released = releaseDate && releaseDate.getTime() <= Date.now();
  const playable = episode.is_playable !== false;
  const unrestricted = !episode.restrictions || Object.keys(episode.restrictions).length === 0;

  return Boolean(episode.id && spotifyUrl && released && playable && unrestricted);
}

function isPublicWebEpisode(episode) {
  const releaseDate = releaseDateToComparableDate(episode.releaseDate?.isoString);
  const released = releaseDate && releaseDate.getTime() <= Date.now();
  const playable = episode.playability?.playable !== false;
  const publicAccess = episode.restrictions?.paywallContent !== true;

  return Boolean(episode.id && episode.uri && released && playable && publicAccess);
}

function formatDuration(ms) {
  const minutes = Math.max(1, Math.round(ms / 60000));
  return `${minutes} min`;
}

function formatDate(value) {
  const date = releaseDateToComparableDate(value);
  if (!date || Number.isNaN(date.getTime())) return value || "";
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Australia/Sydney",
  }).format(date);
}

function episodeLabel(name, fallbackIndex) {
  const match = String(name || "").match(/^Ep\s*0*(\d+)/i);
  return match ? `Episode ${match[1]}` : `Episode ${fallbackIndex + 1}`;
}

function normalizeEpisode(episode, index) {
  const image = Array.isArray(episode.images) && episode.images.length > 0
    ? episode.images[0].url
    : null;

  return {
    id: episode.id,
    n: episodeLabel(episode.name, index),
    title: episode.name,
    desc: episode.description || "",
    len: formatDuration(episode.duration_ms || 0),
    date: formatDate(episode.release_date),
    art: image,
    url: episode.external_urls.spotify,
    spotify_uri: episode.uri,
  };
}

function decodeHtmlText(value) {
  return value
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&#x2F;/g, "/")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function decodeSpotifyState(value) {
  const decoded = Buffer.from(decodeHtmlText(value), "base64").toString("utf8");
  return JSON.parse(decoded);
}

function collectWebEpisodes(value, episodes = [], seen = new Set()) {
  if (!value || typeof value !== "object") return episodes;

  if (
    value.__typename === "Episode" &&
    typeof value.uri === "string" &&
    value.uri.startsWith("spotify:episode:") &&
    !seen.has(value.id)
  ) {
    seen.add(value.id);
    episodes.push(value);
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectWebEpisodes(item, episodes, seen));
  } else {
    Object.values(value).forEach((item) => collectWebEpisodes(item, episodes, seen));
  }

  return episodes;
}

function normalizeWebEpisode(episode, index) {
  const images = episode.coverArt?.sources || [];
  const image = images.find((item) => item.width >= 300)?.url || images[0]?.url || null;
  const spotifyId = episode.uri.split(":").pop();

  return {
    id: episode.id || spotifyId,
    n: episodeLabel(episode.name, index),
    title: episode.name,
    desc: episode.description || "",
    len: formatDuration(episode.duration?.totalMilliseconds || 0),
    date: formatDate(episode.releaseDate?.isoString?.slice(0, 10)),
    art: image,
    url: `https://open.spotify.com/episode/${spotifyId}`,
    spotify_uri: episode.uri,
  };
}

async function getAccessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function getEpisodesPage(accessToken, offset) {
  const params = new URLSearchParams({
    market: MARKET,
    limit: "50",
    offset: String(offset),
  });
  const response = await fetch(`https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify episodes request failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function getPublicEpisodes(accessToken) {
  const episodes = [];
  let offset = 0;
  let total = Infinity;

  while (episodes.length < LIMIT && offset < total) {
    const data = await getEpisodesPage(accessToken, offset);
    total = data.total || 0;
    const items = Array.isArray(data.items) ? data.items : [];
    episodes.push(...items.filter(isPublishedPublicly));
    offset += items.length;
    if (items.length === 0) break;
  }

  return episodes.slice(0, LIMIT);
}

async function getPublicEpisodesFromApi() {
  if (!CLIENT_ID || !CLIENT_SECRET) return null;

  const token = await getAccessToken();
  return (await getPublicEpisodes(token)).map(normalizeEpisode);
}

async function getPublicEpisodesFromWebPage() {
  const response = await fetch(SHOW_URL);

  if (!response.ok) {
    throw new Error(`Spotify show page request failed: ${response.status} ${await response.text()}`);
  }

  const html = await response.text();
  const scriptMatches = [...html.matchAll(/<script[^>]*type="text\/plain"[^>]*>([\s\S]*?)<\/script>/gi)];
  const states = scriptMatches
    .map((match) => {
      try {
        return decodeSpotifyState(match[1].trim());
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const webEpisodes = states.flatMap((state) => collectWebEpisodes(state));
  return webEpisodes
    .filter(isPublicWebEpisode)
    .sort((a, b) => {
      const aDate = releaseDateToComparableDate(a.releaseDate?.isoString)?.getTime() || 0;
      const bDate = releaseDateToComparableDate(b.releaseDate?.isoString)?.getTime() || 0;
      return bDate - aDate;
    })
    .slice(0, LIMIT)
    .map(normalizeWebEpisode);
}

const publicEpisodes = await getPublicEpisodesFromApi() || await getPublicEpisodesFromWebPage();

const payload = {
  generated_at: new Date().toISOString(),
  source: SHOW_URL,
  market: MARKET,
  public_only: true,
  items: publicEpisodes,
};

await mkdir("data", { recursive: true });
await writeFile("data/episodes.json", `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(`Wrote ${payload.items.length} public episodes to data/episodes.json`);
