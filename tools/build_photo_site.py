"""Build the responsive photography index, gallery pages, and WebP assets.

Run from anywhere with:

    python tools/build_photo_site.py

The original photographs remain untouched. Browsing pages use responsive WebP
derivatives and load the original only as a fallback or when the lightbox opens.
"""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PHOTOS_DIR = ROOT / "photos"
OPTIMIZED_DIR = PHOTOS_DIR / "optimized"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
RESPONSIVE_WIDTHS = (640, 1440)

GALLERIES = (
    ("rockymountain", "Rocky Mountain", "RM1.jpg"),
    ("arches", "Arches", "ARCHES_SQ.jpg"),
    ("yellowstone", "Yellowstone", "Y_SQ.jpg"),
    ("grandteton", "Grand Teton", "GT_SQ.jpg"),
    ("sanddunes", "Great Sand Dunes", "SD_SQUARE.JPG"),
    ("grottos", "The Grottos", "GROTTOS_SQUARE.jpg"),
    ("canyonlands", "Canyonlands", "CL_SQUARE.JPG"),
    ("badlands", "Badlands", "BADLANDS_SQUARE3.JPG"),
    ("custer", "Custer State Park", "CUSTER_SQUARE2.JPG"),
    ("zion", "Zion", "ZION_SQUARE.jpg"),
    ("grandcanyon", "Grand Canyon", "GC_SQUARE.jpg"),
    ("yosemite", "Yosemite", "YSMT_SQUARE.JPG"),
    ("capitolreef", "Capitol Reef", "CR_SQUARE.jpg"),
    ("royalgorge", "Royal Gorge", "RG_SQUARE.JPG"),
    ("blackcanyon", "Black Canyon of the Gunnison", "BC_SQUARE.JPEG"),
    ("bluelakes", "Blue Lakes", "BL_SQUARE.JPEG"),
    ("bluesky", "Mount Blue Sky", "BS_SQUARE.JPEG"),
    ("maroonbells", "Maroon Bells", "MB_SQUARE.JPEG"),
    ("misccolorado", "Colorado Collection", "MC_SQUARE.JPEG"),
    ("stmarysglacier", "St. Mary's Glacier", "SMG_SQUARE.JPEG"),
)


def natural_key(path: Path) -> tuple[tuple[int, object], ...]:
    """Return a key that sorts 1, 1.5, 2, ... 10 in viewing order."""
    parts = re.split(r"(\d+(?:\.\d+)?)", path.stem.casefold())
    return tuple(
        (0, float(part)) if re.fullmatch(r"\d+(?:\.\d+)?", part) else (1, part)
        for part in parts
        if part
    )


def is_gallery_photo(path: Path) -> bool:
    return (
        path.is_file()
        and path.suffix.casefold() in IMAGE_EXTENSIONS
        and not re.search(r"(?:square|_sq)", path.stem, re.IGNORECASE)
    )


def webp_path(slug: str, source: Path, requested_width: int) -> Path:
    return OPTIMIZED_DIR / slug / f"{source.stem}-{requested_width}.webp"


def site_path(path: Path) -> str:
    return "/" + path.relative_to(ROOT).as_posix()


def prepare_image(image: Image.Image) -> Image.Image:
    image = ImageOps.exif_transpose(image)
    has_alpha = image.mode in {"RGBA", "LA"} or (
        image.mode == "P" and "transparency" in image.info
    )
    return image.convert("RGBA" if has_alpha else "RGB")


def build_image_record(slug: str, source: Path, write_images: bool) -> dict[str, object]:
    with Image.open(source) as opened:
        source_width, source_height = opened.size
        orientation = opened.getexif().get(274, 1)
        if orientation in {5, 6, 7, 8}:
            source_width, source_height = source_height, source_width

        outputs = [webp_path(slug, source, width) for width in RESPONSIVE_WIDTHS]
        stale_outputs = [
            output
            for output in outputs
            if not output.exists() or output.stat().st_mtime < source.stat().st_mtime
        ]
        image = prepare_image(opened) if write_images and stale_outputs else None
        variants = []

        for requested_width, output in zip(RESPONSIVE_WIDTHS, outputs):
            output_width = min(source_width, requested_width)
            output_height = round(source_height * output_width / source_width)

            if image is not None and output in stale_outputs:
                output.parent.mkdir(parents=True, exist_ok=True)
                resized = image.copy()
                resized.thumbnail(
                    (requested_width, max(source_height, requested_width)),
                    Image.Resampling.LANCZOS,
                )
                resized.save(output, "WEBP", quality=82, method=4)

            variants.append({
                "src": site_path(output),
                "width": output_width,
                "height": output_height,
            })

    # Avoid duplicate srcset descriptors for an unusually small source image.
    unique_variants = {variant["width"]: variant for variant in variants}
    return {
        "src": site_path(source),
        "width": source_width,
        "height": source_height,
        "webp": list(unique_variants.values()),
    }


def render_picture(
    image: dict[str, object],
    alt: str,
    sizes: str,
    *,
    eager: bool = False,
) -> str:
    webp = image["webp"]
    srcset = ", ".join(f'{variant["src"]} {variant["width"]}w' for variant in webp)
    loading = "eager" if eager else "lazy"
    priority = ' fetchpriority="high"' if eager else ""
    return (
        "<picture>"
        f'<source type="image/webp" srcset="{srcset}" sizes="{html.escape(sizes, quote=True)}">'
        f'<img src="{image["src"]}" width="{image["width"]}" height="{image["height"]}" '
        f'alt="{html.escape(alt, quote=True)}" loading="{loading}" decoding="async"{priority}>'
        "</picture>"
    )


def render_gallery_page(gallery: dict[str, object]) -> str:
    title = str(gallery["title"])
    photos = gallery["photos"]
    photo_count = len(photos)
    cards = []

    for index, photo in enumerate(photos, start=1):
        alt = f"{title} photograph {index} of {photo_count}"
        picture = render_picture(
            photo,
            alt,
            "(max-width: 760px) calc(100vw - 2rem), (max-width: 1200px) 46vw, 560px",
            eager=index == 1,
        )
        cards.append(
            "        <figure class=\"gallery-card\">\n"
            f"          <button class=\"gallery-trigger\" type=\"button\" "
            f"data-display-src=\"{photo['webp'][-1]['src']}\" data-original-src=\"{photo['src']}\" "
            f"data-index=\"{index - 1}\" aria-label=\"Open {html.escape(alt, quote=True)}\">\n"
            f"            {picture}\n"
            "          </button>\n"
            f"          <figcaption>Photo {index}</figcaption>\n"
            "        </figure>"
        )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Photography from {html.escape(title, quote=True)} by Grant Hevia.">
  <title>{html.escape(title)} Photos | Grant Hevia</title>
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="icon" type="image/x-icon" href="/Logo_Icon.ico">
  <script src="/js/include.js" defer></script>
  <script src="/js/photo-gallery.js" defer></script>
</head>
<body>
  <div id="header-placeholder"></div>
  <main class="page-shell photo-gallery-page">
    <a class="back-link" href="/photos.html"><span aria-hidden="true">&#8592;</span> All photo collections</a>
    <header class="page-intro">
      <p class="eyebrow">Photography collection</p>
      <h1>{html.escape(title)}</h1>
      <p>{photo_count} photographs. Select any image to view it full screen.</p>
    </header>
    <div class="gallery" data-photo-gallery>
{chr(10).join(cards)}
    </div>
  </main>
  <footer></footer>
</body>
</html>
"""


def render_photo_index(galleries: list[dict[str, object]]) -> str:
    cards = []
    for gallery in galleries:
        title = str(gallery["title"])
        count = len(gallery["photos"])
        picture = render_picture(
            gallery["cover"],
            f"Preview of the {title} photo collection",
            "(max-width: 680px) calc(100vw - 2rem), (max-width: 1080px) 45vw, 350px",
        )
        search_text = f"{title} photography travel landscape".casefold()
        cards.append(
            f'      <article class="collection-card" data-gallery-card data-search="{html.escape(search_text, quote=True)}">\n'
            f'        <a href="/photos/{gallery["slug"]}.html">\n'
            f'          <div class="collection-card__media">{picture}</div>\n'
            "          <div class=\"collection-card__body\">\n"
            f"            <h2>{html.escape(title)}</h2>\n"
            f"            <p>{count} photographs</p>\n"
            "          </div>\n"
            "        </a>\n"
            "      </article>"
        )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Landscape and travel photography collections by Grant Hevia.">
  <title>Photography | Grant Hevia</title>
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="icon" type="image/x-icon" href="/Logo_Icon.ico">
  <script src="/js/include.js" defer></script>
  <script src="/js/photo-gallery.js" defer></script>
</head>
<body>
  <div id="header-placeholder"></div>
  <main class="page-shell collections-page">
    <header class="page-intro page-intro--wide">
      <p class="eyebrow">Through my lens</p>
      <h1>Photography</h1>
      <p>Landscapes, trails, and places worth slowing down for.</p>
    </header>
    <div class="collection-tools">
      <label for="gallery-filter">Find a collection</label>
      <div class="collection-search">
        <input id="gallery-filter" type="search" placeholder="Try Yellowstone or Colorado" autocomplete="off">
        <button id="clear-gallery-filter" type="button" hidden>Clear</button>
      </div>
      <p id="gallery-filter-status" role="status" aria-live="polite">{len(galleries)} collections</p>
    </div>
    <div class="collection-grid">
{chr(10).join(cards)}
    </div>
    <p id="gallery-empty" class="empty-state" hidden>No collections match that search.</p>
  </main>
  <footer></footer>
</body>
</html>
"""


def build(write_images: bool) -> None:
    galleries = []
    processed_sources: dict[Path, dict[str, object]] = {}
    total_images = 0

    for slug, title, cover_name in GALLERIES:
        directory = PHOTOS_DIR / slug
        cover_source = directory / cover_name
        if not cover_source.exists():
            raise FileNotFoundError(f"Missing cover image: {cover_source}")

        sources = sorted((path for path in directory.iterdir() if is_gallery_photo(path)), key=natural_key)
        if not sources:
            raise RuntimeError(f"No gallery photographs found in {directory}")

        def record(source: Path) -> dict[str, object]:
            if source not in processed_sources:
                processed_sources[source] = build_image_record(slug, source, write_images)
            return processed_sources[source]

        photos = [record(source) for source in sources]
        cover = record(cover_source)
        total_images += len(photos)
        galleries.append({
            "slug": slug,
            "title": title,
            "cover": cover,
            "photos": photos,
        })
        print(f"Prepared {title}: {len(photos)} photos")

    manifest = {"galleries": galleries}
    (PHOTOS_DIR / "galleries.json").write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )

    for gallery in galleries:
        output = PHOTOS_DIR / f"{gallery['slug']}.html"
        output.write_text(render_gallery_page(gallery), encoding="utf-8")

    (ROOT / "photos.html").write_text(render_photo_index(galleries), encoding="utf-8")
    print(f"Built {len(galleries)} collections with {total_images} gallery photos")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--skip-images",
        action="store_true",
        help="Regenerate HTML and metadata without writing WebP files.",
    )
    args = parser.parse_args()
    build(write_images=not args.skip_images)


if __name__ == "__main__":
    main()
