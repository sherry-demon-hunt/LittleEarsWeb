import { mkdir, writeFile } from "node:fs/promises";

const SHOW_ID = "033nX1b2ppBSHqZsId9qQK";
const MARKET = process.env.SPOTIFY_MARKET || "AU";
const LIMIT = Number(process.env.SPOTIFY_EPISODE_LIMIT || 5);
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are required.");
}

function releaseDateToComparableDate(value) {
  if (!value) return null;
  if (/^\d{4}$/.test(value)) return new Date(Date.UTC(Number(value), 11, 31, 23, 59, 59));
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month, 0, 23, 59, 59));
  }
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

const token = await getAccessToken();
const publicEpisodes = (await getPublicEpisodes(token)).map(normalizeEpisode);

const payload = {
  generated_at: new Date().toISOString(),
  source: `https://open.spotify.com/show/${SHOW_ID}`,
  market: MARKET,
  public_only: true,
  items: publicEpisodes,
};

await mkdir("data", { recursive: true });
await writeFile("data/episodes.json", `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(`Wrote ${payload.items.length} public episodes to data/episodes.json`);
