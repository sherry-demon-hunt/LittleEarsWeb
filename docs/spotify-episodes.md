# Spotify Episode Feed

Show URL:

```text
https://open.spotify.com/show/033nX1b2ppBSHqZsId9qQK
```

Show ID:

```text
033nX1b2ppBSHqZsId9qQK
```

## Goal

Render the five most recent publicly published Spotify episodes.

## Approach

Use a scheduled build step to generate safe static JSON for the GitHub Pages site.

When Spotify API credentials are available, the script uses the Spotify Web API:

Spotify endpoint:

```text
GET https://api.spotify.com/v1/shows/033nX1b2ppBSHqZsId9qQK/episodes?market=AU&limit=5
```

If `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are not set, the script falls back to Spotify's public show page. That fallback extracts the episode state that Spotify already exposes to anonymous visitors, then filters it before writing `data/episodes.json`.

An episode is included only when it is playable, is not paywalled or restricted, and has a release date that is not in the future. This avoids showing queued or scheduled episodes.

The response includes the fields the site needs:

- `items[].name`
- `items[].description`
- `items[].duration_ms`
- `items[].release_date`
- `items[].external_urls.spotify`
- `items[].id`
- `items[].images`

## Why a Build Step Is Needed

The browser should not call Spotify directly. The Spotify Web API requires an OAuth access token, and the public show page shape is not a stable browser API. Either way, GitHub Pages should serve a checked-in JSON file instead of making every visitor fetch and parse Spotify data.

The static site fetches a checked-in/generated file:

```text
data/episodes.json
```

That file can be refreshed by one of these:

- GitHub Actions on a schedule, with optional `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` repository secrets.
- A tiny serverless function that holds the Spotify secret and returns normalized episode JSON.
- Manual refresh script before publishing.

## Public Embed Option

Spotify oEmbed works without credentials for this show and returns a show iframe:

```text
https://open.spotify.com/oembed?url=https%3A%2F%2Fopen.spotify.com%2Fshow%2F033nX1b2ppBSHqZsId9qQK
```

That is useful if we only want an embedded Spotify player. It does not provide a reliable list of the latest five episodes for custom cards.

## Caveat

The public-page fallback is less stable than the Spotify Web API because Spotify can change its page state format. If the fallback breaks later, add the optional Spotify API secrets and the same script will use the more stable endpoint.
