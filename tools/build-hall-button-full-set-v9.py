#!/usr/bin/env python3
"""构建大厅四枚完整按钮：新底色、新元素，原尺寸、原文字和原 alpha。"""
from collections import deque
from io import BytesIO
from pathlib import Path
import subprocess

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parent.parent
SOURCE_ROOT = ROOT / "assets/branding/hall/selected-v9-full-set/sources"
OUTPUT_ROOT = ROOT / "assets/branding/hall/selected-v9-full-set"
ORIGINAL_ROOT = "cocos-client/assets/resources/Hall/Res/Texture/Center"

# size, source, icon box, top/bottom gradient, glow, text bounds, text reach, body top
BUTTONS = {
    "club_btn": (
        (515, 258), "club.png", (135, 48, 380, 179),
        (255, 202, 72), (255, 142, 48), (255, 239, 144),
        (124, 150, 394, 239), 181, 48,
    ),
    "createroom_btn": (
        (269, 210), "create.png", (28, 7, 241, 151),
        (98, 227, 255), (29, 157, 231), (202, 252, 255),
        (20, 132, 250, 204), 170, 0,
    ),
    "backroom_btn": (
        (269, 210), "back.png", (29, 7, 240, 151),
        (196, 154, 252), (119, 74, 211), (239, 216, 255),
        (20, 132, 250, 204), 170, 0,
    ),
    "joinroom_btn": (
        (277, 213), "join.png", (24, 4, 253, 153),
        (88, 239, 137), (17, 172, 82), (210, 255, 198),
        (50, 134, 263, 207), 172, 0,
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
            reaches = False
            while queue:
                px, py = queue.popleft()
                component.append((px, py))
                reaches |= py >= min_y
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if not (0 <= nx < width and 0 <= ny < height):
                        continue
                    neighbor = ny * width + nx
                    if not visited[neighbor] and source[nx, ny] != 0:
                        visited[neighbor] = 1
                        queue.append((nx, ny))
            if reaches:
                for px, py in component:
                    target[px, py] = 255
    return kept


def make_text_mask(original, bounds, min_y):
    hsv = original.convert("HSV")
    low_saturation = hsv.getchannel("S").point(lambda value: 255 if value < 72 else 0)
    bright_pixels = hsv.getchannel("V").point(lambda value: 255 if value > 165 else 0)
    seed = ImageChops.multiply(low_saturation, bright_pixels)
    limiter = Image.new("L", original.size, 0)
    ImageDraw.Draw(limiter).rectangle(bounds, fill=255)
    seed = keep_components_reaching(ImageChops.multiply(seed, limiter), min_y)
    return seed.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.GaussianBlur(0.7))


def redesign_background(original, top, bottom, glow, body_top):
    size = original.size
    alpha = original.getchannel("A")
    interior = alpha.filter(ImageFilter.MinFilter(11))
    if body_top:
        body = Image.new("L", size, 0)
        ImageDraw.Draw(body).rectangle((0, body_top, size[0], size[1]), fill=255)
        interior = ImageChops.multiply(interior, body)

    output = Image.composite(vertical_gradient(size, top, bottom), original, interior)

    # 统一的柔和中心高光，使四枚按钮成为同一套。
    glow_mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(glow_mask)
    cx = size[0] // 2
    draw.ellipse((cx - size[0] * 0.38, -size[1] * 0.18, cx + size[0] * 0.38, size[1] * 0.72), fill=108)
    glow_mask = glow_mask.filter(ImageFilter.GaussianBlur(max(8, size[1] // 12)))
    glow_mask = ImageChops.multiply(glow_mask, interior)
    output = Image.composite(Image.new("RGBA", size, (*glow, 255)), output, glow_mask)

    # 左上方光带，强化大厅现有的通透玻璃质感。
    sheen = Image.new("L", size, 0)
    sheen_draw = ImageDraw.Draw(sheen)
    sheen_draw.polygon(
        [(0, body_top), (size[0] * 0.50, body_top), (size[0] * 0.25, size[1] * 0.56), (0, size[1] * 0.40)],
        fill=35,
    )
    sheen = ImageChops.multiply(sheen.filter(ImageFilter.GaussianBlur(7)), interior)
    return Image.composite(Image.new("RGBA", size, (255, 255, 255, 255)), output, sheen)


OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
for name, (size, source, icon_box, top, bottom, glow, text_bounds, min_y, body_top) in BUTTONS.items():
    original = original_image(name)
    if original.size != size:
        raise RuntimeError(f"{name} 原图尺寸异常")

    output = redesign_background(original, top, bottom, glow, body_top)
    icon = prepared_icon(SOURCE_ROOT / source, icon_box)
    icon_x = icon_box[0] + (icon_box[2] - icon_box[0] - icon.width) // 2
    icon_y = icon_box[1] + (icon_box[3] - icon_box[1] - icon.height) // 2
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    layer.alpha_composite(icon, (icon_x, icon_y))
    output = Image.alpha_composite(output, layer)

    # 标题在最上层，可轻微压住元素下沿。
    output = Image.composite(original, output, make_text_mask(original, text_bounds, min_y))
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
