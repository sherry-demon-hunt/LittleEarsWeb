// icons.jsx — platform glyphs + decorative sea creatures & sparkles
// All exported to window at the end for cross-script use.

/* ---------- Platform glyphs ---------- */

function SpotifyIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1DB954" />
      <path d="M6.2 9.6c3.9-1.1 8.2-.8 11.4 1.1M7 12.7c3.2-.9 6.6-.6 9.2.9M7.7 15.6c2.5-.7 5-.5 7.1.7"
            stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ApplePodcastsIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ap-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C961E8" />
          <stop offset="1" stopColor="#8B2FD6" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ap-g)" />
      <circle cx="12" cy="9.7" r="2.3" fill="#fff" />
      <path d="M9.1 17.8c0-2 .9-3.2 2.9-3.2s2.9 1.2 2.9 3.2l-.5 2.2c-.1.5-.5.8-1 .8h-2.8c-.5 0-.9-.3-1-.8l-.5-2.2z" fill="#fff" />
      <path d="M7.4 13.9a5.4 5.4 0 1 1 9.2 0" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

function YouTubeIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="1" y="4.5" width="22" height="15" rx="5" fill="#FF0000" />
      <path d="M10 8.8v6.4l5.5-3.2L10 8.8z" fill="#fff" />
    </svg>
  );
}

// Xiaoyuzhou (小宇宙) — little astronaut / cosmos motif
function XiaoyuzhouIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#FA5A4B" />
      <circle cx="12" cy="11" r="4.2" fill="#fff" />
      <circle cx="12" cy="10.4" r="2.4" fill="#FA5A4B" />
      <ellipse cx="12" cy="11" rx="7" ry="2.6" transform="rotate(-22 12 11)"
               stroke="#fff" strokeWidth="1.3" fill="none" opacity="0.9" />
      <path d="M10.7 17.2h2.6l-.5 2.3a.8.8 0 0 1-.78.62h-.04a.8.8 0 0 1-.78-.62l-.5-2.3z" fill="#fff" />
    </svg>
  );
}

const PLATFORM_ICONS = {
  spotify: SpotifyIcon,
  apple: ApplePodcastsIcon,
  youtube: YouTubeIcon,
  xiaoyuzhou: XiaoyuzhouIcon,
};

/* ---------- Decorative sea creatures (chibi, glossy) ---------- */

function Bubble({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      <circle cx="14" cy="13" r="4.5" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
}

function Jellyfish({ size = 80, color = "#F9A8E7" }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96" aria-hidden="true">
      <defs>
        <radialGradient id={`jelly-${color}`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor={color} />
        </radialGradient>
      </defs>
      <path d="M10 40c0-18 13-30 30-30s30 12 30 30c0 6-4 8-10 8H20c-6 0-10-2-10-8z" fill={`url(#jelly-${color})`} opacity="0.92" />
      <g stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.8">
        <path d="M22 48c-2 12 2 22-2 34" />
        <path d="M33 49c-1 13 1 24-1 38" />
        <path d="M47 49c1 13-1 24 1 38" />
        <path d="M58 48c2 12-2 22 2 34" />
      </g>
      <circle cx="32" cy="34" r="3" fill="#3b2a5a" />
      <circle cx="48" cy="34" r="3" fill="#3b2a5a" />
      <path d="M36 40c2 2 6 2 8 0" stroke="#3b2a5a" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Fish({ size = 56, color = "#FFD36E" }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 56 40" aria-hidden="true">
      <path d="M44 20c-8-12-28-12-36 0 8 12 28 12 36 0z" fill={color} />
      <path d="M44 20l10-8v16l-10-8z" fill={color} opacity="0.85" />
      <circle cx="16" cy="18" r="2.6" fill="#3b2a5a" />
    </svg>
  );
}

function Whale({ size = 130, color = "#6C8BE0" }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 130 80" aria-hidden="true">
      <defs>
        <linearGradient id="whale-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8AA6EE" />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <path d="M8 44C8 24 34 14 64 14s54 8 54 26c0 8-6 16-22 18-6 8-14 2-14 2s-8 6-18 2c-30 0-56-8-56-18z" fill="url(#whale-g)" />
      <path d="M118 40c8-6 10-2 8 6-6 2-8-2-8-6z" fill="url(#whale-g)" />
      <path d="M14 46c20 8 60 8 86 0" stroke="#fff" strokeWidth="3" opacity="0.5" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="38" r="3.4" fill="#2b2350" />
      <path d="M50 46c5 4 12 4 17 0" stroke="#2b2350" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Starfish({ size = 44, color = "#FF9EC4" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <path d="M22 3l5.3 11.6 12.7 1.4-9.4 8.7 2.6 12.5L22 31.5 10.8 38.7l2.6-12.5L4 17.5l12.7-1.9L22 3z" fill={color} />
      <g fill="#fff" opacity="0.7">
        <circle cx="22" cy="14" r="1.6" /><circle cx="22" cy="22" r="1.6" /><circle cx="16" cy="26" r="1.4" /><circle cx="28" cy="26" r="1.4" />
      </g>
    </svg>
  );
}

function Sparkle({ size = 24, color = "#FFE38A" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c1 6 5 10 11 12-6 2-10 6-11 12-1-6-5-10-11-12C7 10 11 6 12 0z" fill={color} />
    </svg>
  );
}

Object.assign(window, {
  PLATFORM_ICONS, SpotifyIcon, ApplePodcastsIcon, YouTubeIcon, XiaoyuzhouIcon,
  Bubble, Jellyfish, Fish, Whale, Starfish, Sparkle,
});
