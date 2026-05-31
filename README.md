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
