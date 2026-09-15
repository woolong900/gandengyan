#!/usr/bin/env python3
"""Create the settlement screenshot QR from our public download URL.

Requires Pillow and qrcode. The checked-in output is used by both clients.
"""

from pathlib import Path

import qrcode
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
URL = "https://game.auxvv.com/download/ylhy-activity"
OUTPUT = ROOT / "assets/branding/share/download-qr.png"
ICON = ROOT / "assets/branding/icon.png"


def main():
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=1, border=4)
    qr.add_data(URL)
    qr.make(fit=True)
    image = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    image = image.resize((300, 300), Image.Resampling.NEAREST)
    icon = Image.open(ICON).convert("RGB").resize((42, 42), Image.Resampling.LANCZOS)
    image.paste(Image.new("RGB", (52, 52), "white"), (124, 124))
    image.paste(icon, (129, 129))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT)
    print(f"{OUTPUT}: {URL}")


if __name__ == "__main__":
    main()
