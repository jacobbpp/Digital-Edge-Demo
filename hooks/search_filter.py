from __future__ import annotations

import json
from pathlib import Path


EXCLUDED_LOCATIONS = {""}
SPOTIFY_URL = "https://open.spotify.com/show/4wLAuGMARmMNMvqGnR9iQy"


def on_post_build(config, **kwargs) -> None:
    search_index_path = Path(config.site_dir) / "search" / "search_index.json"
    if search_index_path.exists():
        search_index = json.loads(search_index_path.read_text(encoding="utf-8"))
        search_index["docs"] = [
            entry
            for entry in search_index.get("docs", [])
            if entry.get("location", "").split("#", 1)[0] not in EXCLUDED_LOCATIONS
        ]
        search_index_path.write_text(
            json.dumps(search_index, sort_keys=True, separators=(",", ":")),
            encoding="utf-8",
        )

    for html_path in Path(config.site_dir).rglob("*.html"):
        html = html_path.read_text(encoding="utf-8")

        spotify_link = f'<a href="{SPOTIFY_URL}"'
        if spotify_link in html:
            html = html.replace(
                spotify_link,
                f'{spotify_link} target="_blank" rel="noopener noreferrer"',
            )
            html = html.replace(
                'target="_blank" rel="noopener noreferrer" target="_blank" rel="noopener noreferrer"',
                'target="_blank" rel="noopener noreferrer"',
            )

        html_path.write_text(html, encoding="utf-8")
