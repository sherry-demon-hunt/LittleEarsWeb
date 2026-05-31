# Little Ears Website

This is a static React site that can be hosted directly from the repository root with GitHub Pages. There is no build step.

## Publish with GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open **Settings > Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Select the `main` branch and the repository root (`/`) folder.
5. Save. GitHub will publish the site at:

```text
https://<github-user-or-org>.github.io/<repository-name>/
```

The checked-in `.nojekyll` file tells GitHub Pages to serve the files as plain static assets.

## Spotify episode feed

The latest episode cards are loaded from `data/episodes.json`. A GitHub Actions workflow refreshes that file from Spotify every six hours and can also be run manually from the Actions tab.

The refresh script can use Spotify API credentials when these optional repository secrets are available:

```text
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
```

If those secrets are not set, the script falls back to Spotify's public show page and extracts only currently playable, publicly visible episodes. The refresh script writes only public episodes: each item must be playable and have a release date that is not in the future.

## Local preview

Open the site through a local web server, not by double-clicking `index.html`.

On Windows, double-click:

```bat
start-site.cmd
```

That opens:

```text
http://localhost:8000/
```

Why this is needed: `index.html` loads local JSX files through Babel (`tweaks-panel.jsx`, `icons.jsx`, and `app.jsx`). Browsers block those requests from `file://` pages, so opening `index.html` directly causes CORS errors.
