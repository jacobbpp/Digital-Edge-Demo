from __future__ import annotations

import json
import re
import shutil
from datetime import datetime, timezone
from html import escape, unescape
from pathlib import Path
from urllib.parse import urljoin
from xml.etree import ElementTree


EXCLUDED_LOCATIONS = {""}
HIDDEN_LOCATION_PREFIXES = (
    "guides/",
)
SPOTIFY_URL = "https://open.spotify.com/show/4wLAuGMARmMNMvqGnR9iQy"
FEATURED_EVENT_PATTERN = re.compile(
    r"<!-- de-feature-event:start -->.*?<!-- de-feature-event:end -->",
    re.DOTALL,
)
EVENT_CARD_PATTERN = re.compile(r"<button\s+class=\"de-event-card\"(?P<body>.*?)</button>", re.DOTALL)
EVENT_ATTR_PATTERN = re.compile(r"\sdata-event-(?P<name>[a-z-]+)=\"(?P<value>[^\"]*)\"", re.DOTALL)
EVENT_SUMMARY_PATTERN = re.compile(r"<p>(?P<summary>.*?)</p>", re.DOTALL)


def first_meta_value(value) -> str:
    if isinstance(value, list):
        return str(value[0]) if value else ""
    return str(value or "")


def meta_values(value) -> list[str]:
    if isinstance(value, list):
        values = value
    elif value:
        values = [value]
    else:
        values = []

    expanded: list[str] = []
    for item in values:
        if isinstance(item, str) and "," in item:
            expanded.extend(part.strip() for part in item.split(","))
        else:
            expanded.append(str(item).strip())

    return [item for item in expanded if item]


def meta_tag(name: str, content: str) -> str:
    return f'<meta name="{escape(name, quote=True)}" content="{escape(content, quote=True)}">'


def property_tag(name: str, content: str) -> str:
    return f'<meta property="{escape(name, quote=True)}" content="{escape(content, quote=True)}">'


def build_social_meta(page, config) -> str:
    meta = getattr(page, "meta", {}) or {}
    description = first_meta_value(meta.get("description"))
    if not description:
        return ""

    title = first_meta_value(meta.get("title")) or page.title or config.site_name
    author = first_meta_value(meta.get("author"))
    published = first_meta_value(meta.get("date") or meta.get("published"))
    updated = first_meta_value(meta.get("updated") or meta.get("modified"))
    image = first_meta_value(meta.get("image") or meta.get("social_image"))
    page_type = first_meta_value(meta.get("type")) or ("article" if author or published else "website")
    canonical_url = urljoin(config.site_url or "", page.url)

    tags = [
        meta_tag("description", description),
        property_tag("og:title", title),
        property_tag("og:description", description),
        property_tag("og:type", page_type),
        property_tag("og:url", canonical_url),
        property_tag("og:site_name", config.site_name),
    ]

    if author:
        tags.append(meta_tag("author", author))
        tags.append(property_tag("article:author", author))
    if published:
        tags.append(property_tag("article:published_time", published))
    if updated:
        tags.append(property_tag("article:modified_time", updated))
    for tag in meta_values(meta.get("tags")):
        tags.append(property_tag("article:tag", tag))
    if image:
        absolute_image = urljoin(canonical_url, image)
        tags.append(property_tag("og:image", absolute_image))

    return "\n".join(tags)


def normalise_space(value: str) -> str:
    return " ".join(unescape(value).split())


def event_summary(card_body: str, description: str) -> str:
    match = EVENT_SUMMARY_PATTERN.search(card_body)
    if match:
        return normalise_space(match.group("summary"))

    summary = normalise_space(description)
    if len(summary) <= 150:
        return summary
    return f"{summary[:147].rstrip()}..."


def next_featured_event(config) -> dict[str, str] | None:
    events_path = Path(config.docs_dir) / "events.md"
    if not events_path.exists():
        return None

    now = datetime.now(timezone.utc)
    events: list[tuple[datetime, dict[str, str]]] = []
    source = events_path.read_text(encoding="utf-8")

    for card in EVENT_CARD_PATTERN.finditer(source):
        card_body = card.group("body")
        attrs = {
            match.group("name"): normalise_space(match.group("value"))
            for match in EVENT_ATTR_PATTERN.finditer(card_body)
        }
        if attrs.get("status", "").lower() != "upcoming" or not attrs.get("start"):
            continue

        try:
            start = datetime.fromisoformat(attrs["start"])
        except ValueError:
            continue

        if start.tzinfo is None:
            start = start.replace(tzinfo=timezone.utc)

        if start > now:
            attrs["summary"] = event_summary(card_body, attrs.get("description", ""))
            events.append((start.astimezone(timezone.utc), attrs))

    if not events:
        return None

    return min(events, key=lambda item: item[0])[1]


def featured_event_card(config) -> str:
    event = next_featured_event(config)
    if not event:
        return """<!-- de-feature-event:start -->
  <a href="events/">
    <span>Events</span>
    <strong>Upcoming and Past Sessions</strong>
    <p>See Digital Edge masterclasses, debates, and Performance &amp; Impact sessions.</p>
  </a>
  <!-- de-feature-event:end -->"""

    title = escape(event.get("title", "Upcoming Digital Edge event"), quote=False)
    summary = escape(event.get("summary", "See the next Digital Edge event."), quote=False)

    return f"""<!-- de-feature-event:start -->
  <a href="events/">
    <span>Event</span>
    <strong>{title}</strong>
    <p>{summary}</p>
  </a>
  <!-- de-feature-event:end -->"""


def replace_featured_event(markdown: str, config) -> str:
    return FEATURED_EVENT_PATTERN.sub(featured_event_card(config), markdown, count=1)


def is_hidden_location(location: str) -> bool:
    page_location = location.split("#", 1)[0]
    return any(page_location.startswith(prefix) for prefix in HIDDEN_LOCATION_PREFIXES)


def remove_hidden_sitemap_urls(site_dir: Path) -> None:
    sitemap_path = site_dir / "sitemap.xml"
    if not sitemap_path.exists():
        return

    tree = ElementTree.parse(sitemap_path)
    root = tree.getroot()
    namespace = root.tag.partition("}")[0].strip("{")
    loc_tag = f"{{{namespace}}}loc" if namespace else "loc"

    for url in list(root):
        loc = url.find(loc_tag)
        if loc is not None and loc.text and any(f"/{prefix}" in loc.text for prefix in HIDDEN_LOCATION_PREFIXES):
            root.remove(url)

    tree.write(sitemap_path, encoding="utf-8", xml_declaration=True)


def on_post_page(output: str, page, config, **kwargs) -> str:
    social_meta = build_social_meta(page, config)
    if social_meta and "</head>" in output:
        return output.replace("</head>", f"{social_meta}\n</head>", 1)
    return output


def on_page_markdown(markdown: str, page, config, **kwargs) -> str:
    if getattr(page.file, "src_path", "") == "index.md":
        return replace_featured_event(markdown, config)
    return markdown


def on_post_build(config, **kwargs) -> None:
    site_dir = Path(config.site_dir)
    search_index_path = site_dir / "search" / "search_index.json"
    if search_index_path.exists():
        search_index = json.loads(search_index_path.read_text(encoding="utf-8"))
        search_index["docs"] = [
            entry
            for entry in search_index.get("docs", [])
            if entry.get("location", "").split("#", 1)[0] not in EXCLUDED_LOCATIONS
            and not is_hidden_location(entry.get("location", ""))
        ]
        search_index_path.write_text(
            json.dumps(search_index, sort_keys=True, separators=(",", ":")),
            encoding="utf-8",
        )

    remove_hidden_sitemap_urls(site_dir)

    for prefix in HIDDEN_LOCATION_PREFIXES:
        shutil.rmtree(site_dir / prefix.rstrip("/"), ignore_errors=True)

    for html_path in site_dir.rglob("*.html"):
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
