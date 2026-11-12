#!/usr/bin/env python3
"""保留原按钮的字体、边框与逐像素 alpha，只在图标区融合新设计。"""
from io import BytesIO
from pathlib import Path
import subprocess

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parent.parent
INPUT_ROOT = ROOT / "assets/branding/hall/selected-v5"
OUTPUT_ROOT = ROOT / "assets/branding/hall/selected-v6"
ORIGINAL_ROOT = "cocos-client/assets/resources/Hall/Res/Texture/Center"

# (width, height, icon blend box, corner radius, feather radius)
ENTRIES = {
    "club_btn": (515, 258, (100, 18, 410, 146), 26, 3),
    "createroom_btn": (269, 210, (35, 15, 235, 128), 20, 3),
    "joinroom_btn": (277, 213, (30, 12, 250, 130), 20, 3),
    "backroom_btn": (269, 210, (30, 12, 240, 130), 20, 3),
}


def original_image(name: str) -> Image.Image:
    blob = subprocess.run(
        ["git", "-C", str(ROOT), "show", f"HEAD:{ORIGINAL_ROOT}/{name}.png"],
        check=True,
        stdout=subprocess.PIPE,
    ).stdout
    return Image.open(BytesIO(blob)).convert("RGBA")


OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
for name, (width, height, box, radius, feather) in ENTRIES.items():
    original = original_image(name)
    generated = Image.open(INPUT_ROOT / f"{name}.png").convert("RGBA")
    if original.size != (width, height) or generated.size != original.size:
        raise RuntimeError(f"{name} 尺寸异常")

    # 使用小范围羽化蒙版，仅替换图标；字体和外轮廓保留原生抗锯齿。
    mask = Image.new("L", original.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(box, radius=radius, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather))
    # 再与原 alpha 相乘，防止新图的隐藏 RGB 渗入低透明度像素形成彩色光晕。
    mask = ImageChops.multiply(mask, original.getchannel("A"))
    output = Image.composite(generated, original, mask)

    # 不重算 alpha，直接复制原素材的逐像素透明通道。
    original_alpha = original.getchannel("A")
    output.putalpha(original_alpha)
    output_path = OUTPUT_ROOT / f"{name}.png"
    output.save(output_path, optimize=True)

    verified = Image.open(output_path).convert("RGBA")
    if verified.size != (width, height):
        raise RuntimeError(f"{name} 输出尺寸校验失败")
    if verified.getchannel("A").tobytes() != original_alpha.tobytes():
        raise RuntimeError(f"{name} 透明通道与原图不一致")
    print(f"{name}: {width}x{height} RGBA, alpha-diff=0")
