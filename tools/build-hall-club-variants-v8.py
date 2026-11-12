#!/usr/bin/env python3
"""生成 3 款俱乐部按钮方案：保留原尺寸、原文字和原 alpha。"""
from collections import deque
from io import BytesIO
from pathlib import Path
import subprocess

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parent.parent
SOURCE_ROOT = ROOT / "assets/branding/hall/selected-v8-club-variants/sources"
OUTPUT_ROOT = ROOT / "assets/branding/hall/selected-v8-club-variants"
ORIGINAL_PATH = "cocos-client/assets/resources/Hall/Res/Texture/Center/club_btn.png"
SIZE = (515, 258)

VARIANTS = {
    "club_btn_01_table.png": "club-table.png",
    "club_btn_02_fan.png": "club-fan.png",
    "club_btn_03_gate.png": "club-gate.png",
}


def original_image() -> Image.Image:
    blob = subprocess.run(
        ["git", "-C", str(ROOT), "show", f"HEAD:{ORIGINAL_PATH}"],
        check=True,
        stdout=subprocess.PIPE,
    ).stdout
    return Image.open(BytesIO(blob)).convert("RGBA")


def vertical_gradient(size, top, bottom):
    width, height = size
    image = Image.new("RGBA", size)
    pixels = []
    for y in range(height):
        ratio = y / max(height - 1, 1)
        color = tuple(round(top[i] * (1 - ratio) + bottom[i] * ratio) for i in range(3))
        pixels.extend([(*color, 255)] * width)
    image.putdata(pixels)
    return image


def prepared_icon(path: Path, box):
    icon = Image.open(path).convert("RGBA")
    visible = icon.getchannel("A").point(lambda alpha: 255 if alpha >= 12 else 0)
    bounds = visible.getbbox()
    if not bounds:
        raise RuntimeError(f"{path.name} 没有可见像素")
    icon = icon.crop(bounds)
    target_width = box[2] - box[0]
    target_height = box[3] - box[1]
    premultiplied = icon.convert("RGBa")
    premultiplied.thumbnail((target_width, target_height), Image.Resampling.LANCZOS)
    return premultiplied.convert("RGBA")


def keep_components_reaching(mask: Image.Image, min_y: int) -> Image.Image:
    """保留延伸到文字主体的白色连通块，排除原图标中的亮色元素。"""
    width, height = mask.size
    source = mask.load()
    visited = bytearray(width * height)
    kept = Image.new("L", mask.size, 0)
    target = kept.load()

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or source[x, y] == 0:
                continue
            visited[index] = 1
            queue = deque([(x, y)])
            component = []
            reaches_text_body = False
            while queue:
                px, py = queue.popleft()
                component.append((px, py))
                reaches_text_body |= py >= min_y
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if not (0 <= nx < width and 0 <= ny < height):
                        continue
                    neighbor = ny * width + nx
                    if not visited[neighbor] and source[nx, ny] != 0:
                        visited[neighbor] = 1
                        queue.append((nx, ny))
            if reaches_text_body:
                for px, py in component:
                    target[px, py] = 255
    return kept


def text_mask(original: Image.Image) -> Image.Image:
    hsv = original.convert("HSV")
    low_saturation = hsv.getchannel("S").point(lambda value: 255 if value < 72 else 0)
    bright_pixels = hsv.getchannel("V").point(lambda value: 255 if value > 165 else 0)
    seed = ImageChops.multiply(low_saturation, bright_pixels)
    bounds = Image.new("L", SIZE, 0)
    ImageDraw.Draw(bounds).rectangle((124, 146, 394, 239), fill=255)
    seed = keep_components_reaching(ImageChops.multiply(seed, bounds), 181)
    return seed.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.GaussianBlur(0.7))


def build_variant(original: Image.Image, icon_path: Path, output_path: Path):
    output = original.copy()

    cleanup = Image.new("L", SIZE, 0)
    ImageDraw.Draw(cleanup).rounded_rectangle((72, 28, 443, 184), radius=24, fill=255)
    cleanup = cleanup.filter(ImageFilter.GaussianBlur(4))
    cleanup = ImageChops.multiply(cleanup, original.getchannel("A"))
    background = vertical_gradient(SIZE, (255, 195, 64), (255, 157, 47))
    output = Image.composite(background, output, cleanup)

    icon_box = (137, 49, 378, 177)
    icon = prepared_icon(icon_path, icon_box)
    x = icon_box[0] + (icon_box[2] - icon_box[0] - icon.width) // 2
    y = icon_box[1] + (icon_box[3] - icon_box[1] - icon.height) // 2
    layer = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    layer.alpha_composite(icon, (x, y))
    output = Image.alpha_composite(output, layer)

    # 原文字回到最上层，允许标题轻微压住图标下沿。
    output = Image.composite(original, output, text_mask(original))
    original_alpha = original.getchannel("A")
    output.putalpha(original_alpha)
    output.save(output_path, optimize=True)

    verified = Image.open(output_path).convert("RGBA")
    if verified.size != SIZE:
        raise RuntimeError(f"{output_path.name} 尺寸校验失败")
    if verified.getchannel("A").tobytes() != original_alpha.tobytes():
        raise RuntimeError(f"{output_path.name} alpha 与原图不一致")


OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
original = original_image()
for output_name, source_name in VARIANTS.items():
    build_variant(original, SOURCE_ROOT / source_name, OUTPUT_ROOT / output_name)
    print(f"{output_name}: 515x258 RGBA, alpha-diff=0")
