from __future__ import annotations

import json
from pathlib import Path


EXCLUDED_LOCATIONS = {""}
SPOTIFY_URL = "https://open.spotify.com/show/4wLAuGMARmMNMvqGnR9iQy"
GA_MEASUREMENT_ID = "G-645ZLH00LY"
LIVE_HOSTNAME = "jacobbpp.github.io"


def analytics_snippet() -> str:
    return f"""<script>
  (function () {{
    if (window.location.hostname !== "{LIVE_HOSTNAME}") return;

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id={GA_MEASUREMENT_ID}";
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {{ window.dataLayer.push(arguments); }}
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", "{GA_MEASUREMENT_ID}");
  }})();
</script>"""


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

    snippet = analytics_snippet()

    for html_path in Path(config.site_dir).rglob("*.html"):
        html = html_path.read_text(encoding="utf-8")

        if GA_MEASUREMENT_ID not in html and "</head>" in html:
            html = html.replace("</head>", f"{snippet}\n</head>", 1)

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
