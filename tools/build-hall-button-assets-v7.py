#!/usr/bin/env python3
"""在原按钮字体、边框和 alpha 不变的前提下，替换为全新功能图标。"""
from io import BytesIO
from pathlib import Path
import subprocess
from collections import deque

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parent.parent
SOURCE_ROOT = ROOT / "assets/branding/hall/selected-v7/sources"
OUTPUT_ROOT = ROOT / "assets/branding/hall/selected-v7"
ORIGINAL_ROOT = "cocos-client/assets/resources/Hall/Res/Texture/Center"

# name: (size, icon file, cleanup box, icon box, gradient top, gradient bottom)
ENTRIES = {
    "club_btn": (
        (515, 258), "club-icon.png", (82, 34, 433, 160), (155, 51, 360, 172),
        (255, 195, 64), (255, 157, 47),
    ),
    "createroom_btn": (
        (269, 210), "create-icon.png", (24, 12, 245, 132), (57, 12, 216, 132),
        (91, 216, 255), (35, 170, 237),
    ),
    "joinroom_btn": (
        (277, 213), "join-icon.png", (24, 10, 253, 134), (43, 12, 238, 132),
        (83, 235, 118), (25, 194, 80),
    ),
    "backroom_btn": (
        (269, 210), "back-icon.png", (23, 10, 246, 134), (45, 12, 226, 132),
        (191, 139, 244), (135, 91, 224),
    ),
}


def original_image(name: str) -> Image.Image:
    blob = subprocess.run(
        ["git", "-C", str(ROOT), "show", f"HEAD:{ORIGINAL_ROOT}/{name}.png"],
        check=True,
        stdout=subprocess.PIPE,
    ).stdout
    return Image.open(BytesIO(blob)).convert("RGBA")


def vertical_gradient(size, top, bottom):
    width, height = size
    gradient = Image.new("RGBA", size)
    pixels = []
    for y in range(height):
        ratio = y / max(height - 1, 1)
        color = tuple(round(top[i] * (1 - ratio) + bottom[i] * ratio) for i in range(3))
        pixels.extend([(*color, 255)] * width)
    gradient.putdata(pixels)
    return gradient


def prepared_icon(path: Path, box):
    icon = Image.open(path).convert("RGBA")
    visible = icon.getchannel("A").point(lambda alpha: 255 if alpha >= 12 else 0)
    bounds = visible.getbbox()
    if not bounds:
        raise RuntimeError(f"{path.name} 没有可见像素")
    icon = icon.crop(bounds)
    target_width = box[2] - box[0]
    target_height = box[3] - box[1]
    # 在预乘 alpha 空间中缩小，避免高对比图标边缘出现白边或锯齿。
    premultiplied = icon.convert("RGBa")
    premultiplied.thumbnail((target_width, target_height), Image.Resampling.LANCZOS)
    return premultiplied.convert("RGBA")


def keep_components_reaching(mask: Image.Image, min_y: int) -> Image.Image:
    """只保留向下延伸到 min_y 的连通块，用于排除文字上方的旧图标。"""
    width, height = mask.size
    source = mask.load()
    visited = bytearray(width * height)
    kept = Image.new("L", mask.size, 0)
    kept_pixels = kept.load()

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
                    kept_pixels[px, py] = 255
    return kept


OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
for name, (size, icon_file, cleanup_box, icon_box, gradient_top, gradient_bottom) in ENTRIES.items():
    original = original_image(name)
    if original.size != size:
        raise RuntimeError(f"{name} 原图尺寸异常")

    output = original.copy()
    cleanup_mask = Image.new("L", size, 0)
    ImageDraw.Draw(cleanup_mask).rounded_rectangle(cleanup_box, radius=22, fill=255)
    cleanup_mask = cleanup_mask.filter(ImageFilter.GaussianBlur(4))
    # 不让清理色渗入原图的低透明度外缘像素。
    cleanup_mask = ImageChops.multiply(cleanup_mask, original.getchannel("A"))
    output = Image.composite(vertical_gradient(size, gradient_top, gradient_bottom), output, cleanup_mask)

    icon = prepared_icon(SOURCE_ROOT / icon_file, icon_box)
    icon_x = icon_box[0] + (icon_box[2] - icon_box[0] - icon.width) // 2
    icon_y = icon_box[1] + (icon_box[3] - icon_box[1] - icon.height) // 2
    icon_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    icon_layer.alpha_composite(icon, (icon_x, icon_y))
    output = Image.alpha_composite(output, icon_layer)

    if name == "club_btn":
        # 让放大后的麻将桌轻微伸到标题区，再把原文字叠回最上层，
        # 形成“文字压住元素”的层次，同时不重绘原字体。
        hsv = original.convert("HSV")
        low_saturation = hsv.getchannel("S").point(lambda value: 255 if value < 72 else 0)
        bright_pixels = hsv.getchannel("V").point(lambda value: 255 if value > 165 else 0)
        text_seed = ImageChops.multiply(low_saturation, bright_pixels)
        text_bounds = Image.new("L", size, 0)
        ImageDraw.Draw(text_bounds).rectangle((124, 146, 394, 239), fill=255)
        text_mask = ImageChops.multiply(text_seed, text_bounds)
        text_mask = keep_components_reaching(text_mask, 181)
        text_mask = text_mask.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.GaussianBlur(0.7))
        output = Image.composite(original, output, text_mask)

    original_alpha = original.getchannel("A")
    output.putalpha(original_alpha)
    output_path = OUTPUT_ROOT / f"{name}.png"
    output.save(output_path, optimize=True)

    verified = Image.open(output_path).convert("RGBA")
    if verified.size != size:
        raise RuntimeError(f"{name} 输出尺寸校验失败")
    if verified.getchannel("A").tobytes() != original_alpha.tobytes():
        raise RuntimeError(f"{name} 透明通道与原图不一致")
    print(f"{name}: {size[0]}x{size[1]} RGBA, alpha-diff=0")
