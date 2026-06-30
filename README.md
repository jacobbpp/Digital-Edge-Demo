# Digital Edge

An MkDocs website for Digital Edge: articles, discovery guides, learning paths, events, newsletters, people profiles, and browser-based JavaScript guided practice.

The published site is configured for GitHub Pages at `https://jacobbpp.github.io/Digital-Edge-Demo/`. For local development, use the local MkDocs config so the preview serves cleanly from `/`.

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m mkdocs serve -f mkdocs.local.yml --dev-addr 127.0.0.1:8001
```

Then open `http://127.0.0.1:8001/`.

## Build

```bash
python3 -m mkdocs build
```

## Structure

- `docs/` contains the website pages and assets.
- `docs/assets/css/site.css` contains the custom Digital Edge styling.
- `docs/assets/js/site.js` contains search polish, event modal behaviour, copy buttons, and guided JavaScript practice.
- `hooks/search_filter.py` adjusts the built search index and opens Spotify links safely.
- `mkdocs.yml` is the published site configuration.
- `mkdocs.local.yml` inherits the published config and overrides `site_url` for local preview.
