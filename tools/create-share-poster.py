#!/usr/bin/env python3
"""Compose exact game lettering and a scannable QR over the cleaned poster.

Requires Pillow. The checked-in JPEG is used by the Android and iOS packages.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
BRANDING = ROOT / "assets/branding/share"
FONT = Path("/System/Library/Fonts/STHeiti Medium.ttc")


def centered(draw, image_width, text, font, top, color):
    box = draw.textbbox((0, 0), text, font=font)
    draw.text(((image_width - (box[2] - box[0])) / 2 - box[0], top - box[1]),
              text, font=font, fill=color)


def main():
    poster = Image.open(BRANDING / "moments-poster-base.png").convert("RGB")
    if poster.size != (720, 1280):
        raise ValueError(f"unexpected poster size: {poster.size}")
    draw = ImageDraw.Draw(poster)
    centered(draw, poster.width, "潜江干瞪眼", ImageFont.truetype(str(FONT), 72), 135, "#31251d")
    centered(draw, poster.width, "约上好友开一局", ImageFont.truetype(str(FONT), 41), 224, "#cf5732")
    qr = Image.open(BRANDING / "download-qr.png").convert("RGB")
    poster.paste(qr.resize((174, 174), Image.Resampling.NEAREST), (493, 1078))
    output = BRANDING / "moments-poster.jpg"
    poster.save(output, quality=94, subsampling=0)
    print(output)


if __name__ == "__main__":
    main()
