# Little Ears Website

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
