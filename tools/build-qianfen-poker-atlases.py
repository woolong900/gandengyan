#!/usr/bin/env python3
"""Replace the standard Poker sprites in the recovered atlases with Qianfen art.

The hot-update client loads already-packed Cocos dynamic atlases.  Repacking them
would change every sprite coordinate, so this tool locates each existing card by
its exact pixels and replaces only that rectangle.  Other game-specific cards
(wild cards, stars, weapons, labels, etc.) remain untouched.
"""

from __future__ import annotations

import argparse
import hashlib
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
POKER_DIR = ROOT / "cocos-client/assets/resources/Games/Poker"
ATLAS_DIR = ROOT / "client-release-source/assets/resources/_RecoveredDependencies/Textures"
ATLAS_NAMES = ("1580e8a3b.png", "1e79e9934.png", "1a62d6dfc.png", "191f83490.png")
CARD_SIZE = (164, 218)


def digest(image: Image.Image) -> str:
    rgba = image.convert("RGBA")
    # The dynamic atlas preserves arbitrary RGB bytes under fully transparent
    # pixels. Canonicalise them so visually identical source sprites still match.
    canonical = Image.alpha_composite(Image.new("RGBA", rgba.size, (0, 0, 0, 0)), rgba)
    return hashlib.sha256(canonical.tobytes()).hexdigest()


def opaque_components(image: Image.Image) -> list[tuple[int, int, int, int]]:
    """Return four-connected non-transparent component bounding boxes."""
    alpha = image.getchannel("A")
    width, height = image.size
    pixels = alpha.load()
    visited = bytearray(width * height)
    boxes: list[tuple[int, int, int, int]] = []

    for y in range(height):
        row = y * width
        for x in range(width):
            offset = row + x
            if visited[offset] or pixels[x, y] == 0:
                continue
            visited[offset] = 1
            queue = deque([(x, y)])
            left = right = x
            top = bottom = y
            count = 0
            while queue:
                px, py = queue.popleft()
                count += 1
                left = min(left, px)
                right = max(right, px)
                top = min(top, py)
                bottom = max(bottom, py)
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    neighbor = ny * width + nx
                    if not visited[neighbor] and pixels[nx, ny] != 0:
                        visited[neighbor] = 1
                        queue.append((nx, ny))
            # Ignore tiny disconnected marks. A full card body is much larger.
            if count > 5_000:
                boxes.append((left, top, right + 1, bottom + 1))
    return boxes


def qianfen_cells(source: Image.Image) -> dict[str, Image.Image]:
    rows = (
        ("00", "22", "23", "24", "25", "26", "27", "28", "29", "21"),
        ("2b", "2d", "2c", "2a", "12", "13", "14", "15", "16", "17"),
        ("18", "19", "11", "1b", "1d", "1c", "1a", "32", "33", "34"),
        ("35", "36", "37", "38", "39", "31", "3b", "3d", "3c", "3a"),
        ("5e", "5f", "42", "43", "44", "45", "46", "47", "48", "49"),
        ("41", "4b", "4d", "4c", "4a"),
    )
    cards: dict[str, Image.Image] = {}
    for row_index, row in enumerate(rows):
        for column_index, code in enumerate(row):
            crop = source.crop(
                (
                    column_index * 190,
                    row_index * 256,
                    (column_index + 1) * 190,
                    (row_index + 1) * 256,
                )
            )
            cards[code] = crop.resize(CARD_SIZE, Image.Resampling.LANCZOS)
    if len(cards) != 55:
        raise RuntimeError(f"expected 55 Qianfen sprites, got {len(cards)}")
    return cards


def reference_variants() -> dict[str, tuple[str, str, Image.Image]]:
    variants: dict[str, tuple[str, str, Image.Image]] = {}
    codes = ["00", "5e", "5f"] + [f"{suit:x}{rank:x}" for suit in range(1, 5) for rank in range(1, 14)]
    for code in codes:
        reference = Image.open(POKER_DIR / f"card_{code}.png").convert("RGBA")
        for direction, image in (
            ("normal", reference),
            ("ccw", reference.transpose(Image.Transpose.ROTATE_90)),
            ("cw", reference.transpose(Image.Transpose.ROTATE_270)),
        ):
            if image.getbbox() is None:
                raise RuntimeError(f"empty reference sprite: card_{code}.png")
            key = digest(image)
            if key in variants:
                other = variants[key][0]
                raise RuntimeError(f"duplicate reference pixels: card_{code} and card_{other}")
            variants[key] = (code, direction, image)
    return variants


def extrude(image: Image.Image) -> Image.Image:
    """Add the one-pixel edge extrusion used by the recovered Cocos atlases."""
    width, height = image.size
    output = Image.new("RGBA", (width + 2, height + 2), (0, 0, 0, 0))
    output.paste(image, (1, 1))
    output.paste(image.crop((0, 0, width, 1)), (1, 0))
    output.paste(image.crop((0, height - 1, width, height)), (1, height + 1))
    output.paste(image.crop((0, 0, 1, height)), (0, 1))
    output.paste(image.crop((width - 1, 0, width, height)), (width + 1, 1))
    output.putpixel((0, 0), image.getpixel((0, 0)))
    output.putpixel((width + 1, 0), image.getpixel((width - 1, 0)))
    output.putpixel((0, height + 1), image.getpixel((0, height - 1)))
    output.putpixel((width + 1, height + 1), image.getpixel((width - 1, height - 1)))
    return output


def replace_atlases(source_atlas: Path, output_dir: Path, individual_dir: Path | None = None) -> None:
    qianfen = qianfen_cells(Image.open(source_atlas).convert("RGBA"))
    variants = reference_variants()
    found: dict[str, str] = {}
    output_dir.mkdir(parents=True, exist_ok=True)

    for atlas_name in ATLAS_NAMES:
        atlas_path = ATLAS_DIR / atlas_name
        atlas = Image.open(atlas_path).convert("RGBA")
        for component in opaque_components(atlas):
            candidate = atlas.crop(component)
            if candidate.width < 3 or candidate.height < 3:
                continue
            # Dynamic-atlas packing extrudes one edge pixel on every side.
            inner = candidate.crop((1, 1, candidate.width - 1, candidate.height - 1))
            match = variants.get(digest(inner))
            if match is None:
                continue
            code, direction, oriented_reference = match
            if code in found:
                raise RuntimeError(f"card_{code} found twice: {found[code]} and {atlas_name}")
            replacement = qianfen[code]
            if direction == "normal":
                oriented_replacement = replacement
            elif direction == "ccw":
                oriented_replacement = replacement.transpose(Image.Transpose.ROTATE_90)
            elif direction == "cw":
                oriented_replacement = replacement.transpose(Image.Transpose.ROTATE_270)
            else:
                raise RuntimeError(f"unexpected packing direction for card_{code}: {direction}")
            packed_replacement = extrude(oriented_replacement)
            if packed_replacement.size != candidate.size:
                raise RuntimeError(
                    f"packed size mismatch for card_{code}: {packed_replacement.size} != {candidate.size}"
                )
            atlas.paste(packed_replacement, (component[0], component[1]))
            found[code] = atlas_name
        atlas.save(output_dir / atlas_name, optimize=True)

    expected = set(qianfen)
    missing = sorted(expected - set(found))
    if missing:
        raise RuntimeError(f"failed to locate {len(missing)} cards in recovered atlases: {', '.join(missing)}")

    # Also export the individual sprites so future Cocos builds use the same art.
    individual_dir = individual_dir or (output_dir / "individual")
    individual_dir.mkdir(exist_ok=True)
    for code, image in qianfen.items():
        image.save(individual_dir / f"card_{code}.png", optimize=True)

    print(f"replaced {len(found)} sprites across {len(ATLAS_NAMES)} atlases")
    for atlas_name in ATLAS_NAMES:
        count = sum(1 for value in found.values() if value == atlas_name)
        print(f"  {atlas_name}: {count}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-atlas", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--individual-dir", type=Path)
    args = parser.parse_args()
    replace_atlases(args.source_atlas, args.output_dir, args.individual_dir)


if __name__ == "__main__":
    main()
