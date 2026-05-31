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

## Recommended Approach

Use the Spotify Web API from a backend or scheduled build step, then expose safe static JSON to the GitHub Pages site.

Spotify endpoint:

```text
GET https://api.spotify.com/v1/shows/033nX1b2ppBSHqZsId9qQK/episodes?market=AU&limit=5
```

The refresh script filters the response before writing `data/episodes.json`. An episode is included only when it has a Spotify URL, is playable for the configured market, and has a release date that is not in the future. This avoids showing queued or scheduled episodes.

The response includes the fields the site needs:

- `items[].name`
- `items[].description`
- `items[].duration_ms`
- `items[].release_date`
- `items[].external_urls.spotify`
- `items[].id`
- `items[].images`

## Why a Backend or Build Step Is Needed

Spotify's show episodes endpoint requires an OAuth access token. The simplest suitable flow is Client Credentials, but that requires a Spotify client secret. That secret cannot be safely stored in browser JavaScript on GitHub Pages.

The static site fetches a checked-in/generated file:

```text
data/episodes.json
```

That file can be refreshed by one of these:

- GitHub Actions on a schedule, using `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` repository secrets.
- A tiny serverless function that holds the Spotify secret and returns normalized episode JSON.
- Manual refresh script before publishing.

## Public Embed Option

Spotify oEmbed works without credentials for this show and returns a show iframe:

```text
https://open.spotify.com/oembed?url=https%3A%2F%2Fopen.spotify.com%2Fshow%2F033nX1b2ppBSHqZsId9qQK
```

That is useful if we only want an embedded Spotify player. It does not provide a reliable list of the latest five episodes for custom cards.

## Avoid

Do not scrape the Spotify show page for episode data. The page currently contains enough internal data to infer episodes, but it is encoded in Spotify's app shell and is not a stable public contract.
