#!/usr/bin/env python3
"""Render the canonical legal Markdown into Cocos textures and public HTML."""
from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from html import escape
from pathlib import Path
import re
import shutil

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
LEGAL = ROOT / "legal"
CLIENT = ROOT / "client-cocos-recovered/assets/resources/Hall/Res/Texture/Login"
LEGACY = ROOT / "assets/branding/legacy-cleanup"
PUBLIC = ROOT / "server/public/legal"
FONT_FILE = next(path for path in (
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
) if Path(path).exists())


@dataclass(frozen=True)
class PageAsset:
    filename: str
    uuid: str
    size: tuple[int, int]


USER_PAGES = (
    PageAsset("agreement_desc1.png", "f89eca2a-97a6-4480-9d24-bdf2fec1e807", (819, 1581)),
    PageAsset("agreement_desc2.png", "86115981-b1e7-4574-88c0-6adf4563f91e", (816, 1531)),
    PageAsset("agreement_desc3.png", "82be7cfd-7645-48fb-be16-ca5614445206", (822, 1585)),
    PageAsset("agreement_desc4.png", "9e1d8bd6-cd26-4e22-a927-e3cab8f662f2", (815, 1544)),
    PageAsset("agreement_desc5.png", "c2f63047-687e-418a-8b49-d3d2b9a9037a", (823, 1315)),
)

PRIVACY_PAGES = (
    PageAsset("agreement_sec_desc1.png", "ff4a224b-c762-451f-badc-e999f4d4f91d", (819, 1620)),
    PageAsset("agreement_sec_desc2.png", "edc0c639-e30d-4c2d-8913-0a2097900a18", (823, 1563)),
    PageAsset("agreement_sec_desc3.png", "ea477dc4-ec95-408b-9f36-4fce061f860b", (822, 1591)),
    PageAsset("agreement_sec_desc4.png", "0dfd7eef-0c01-49dc-9ea5-6a064dd043a4", (824, 1610)),
    PageAsset("agreement_sec_desc5.png", "fefaa479-cae1-4e8e-9cb3-2c80b77e45c0", (818, 1539)),
    PageAsset("agreement_sec_desc6.png", "fffc6144-172f-464a-8f28-237747531559", (823, 1589)),
    PageAsset("agreement_sec_desc7.png", "5f082ba6-924b-4816-859d-11652ace23c7", (824, 1789)),
    PageAsset("agreement_sec_desc8.png", "02108912-ccb8-4dd0-ad93-95c7eeb0ee8c", (823, 1652)),
    PageAsset("agreement_sec_desc9.png", "c148b136-46b0-434e-aab0-af56831c6811", (823, 1702)),
    PageAsset("agreement_sec_desc10.png", "7a66c68d-c67b-4977-881c-c9e860a9556f", (821, 2185)),
    PageAsset("agreement_sec_desc11.png", "af282322-83b5-482f-9f1a-9f7c5e822465", (819, 1530)),
    PageAsset("agreement_sec_desc12.png", "4da95e83-9a7e-44c5-9b68-af22d3976ad9", (823, 1556)),
    PageAsset("agreement_sec_desc13.png", "ffc64a37-3667-407d-990a-9e5625f3152d", (819, 1755)),
    PageAsset("agreement_sec_desc14.png", "416bd497-d77c-4156-86c3-119055d8ddc1", (818, 1553)),
    PageAsset("agreement_sec_desc15.png", "4b3348da-cd23-f1ee-0478-fa12e7d1c548", (818, 523)),
)


@lru_cache(maxsize=None)
def face(size: int, index: int = 0):
    return ImageFont.truetype(FONT_FILE, size=size, index=index)


def pages(markdown: str) -> list[str]:
    return [part.strip() for part in re.split(r"\n\s*<!--\s*page\s*-->\s*\n", markdown) if part.strip()]


def strip_inline(value: str) -> str:
    value = re.sub(r"\[([^]]+)]\(([^)]+)\)", r"\1（\2）", value)
    return value.replace("**", "").replace("`", "")


def logical_lines(markdown: str) -> list[tuple[str, str]]:
    lines: list[tuple[str, str]] = []
    for raw in markdown.splitlines():
        text = raw.strip()
        if not text:
            lines.append(("blank", ""))
        elif text.startswith("# "):
            lines.append(("title", strip_inline(text[2:])))
        elif text.startswith("## "):
            lines.append(("h2", strip_inline(text[3:])))
        elif text.startswith("### "):
            lines.append(("h3", strip_inline(text[4:])))
        elif re.match(r"^[-*]\s+", text):
            lines.append(("body", "• " + strip_inline(re.sub(r"^[-*]\s+", "", text))))
        else:
            lines.append(("body", strip_inline(text)))
    # Consecutive blank lines do not improve the small in-game canvas.
    compact: list[tuple[str, str]] = []
    for item in lines:
        if item[0] == "blank" and (not compact or compact[-1][0] == "blank"):
            continue
        compact.append(item)
    return compact


def flow_blocks(markdown: str) -> list[tuple[str, str]]:
    """Return small semantic blocks suitable for balanced in-game pagination."""
    output: list[tuple[str, str]] = []
    skip_directory_body = False
    for kind, text in logical_lines(markdown.replace("<!-- page -->", "")):
        if kind == "blank":
            continue
        # The texture viewer is already a linear scroll view, so a non-clickable
        # table of contents only consumes a large part of the first screen. The
        # canonical Markdown and public web page still retain it.
        if kind == "h2" and text == "本政策目录":
            skip_directory_body = True
            continue
        if skip_directory_body:
            skip_directory_body = False
            if kind == "body":
                continue
        if kind == "body" and text.startswith("更新日期：") and "生效日期：" in text:
            updated, effective = text.split("生效日期：", 1)
            output.append(("meta", updated.strip()))
            output.append(("meta", f"生效日期：{effective.strip()}"))
            continue
        if kind != "body":
            output.append((kind, text))
            continue
        # A whole paragraph as one indivisible block leaves large holes whenever
        # the next paragraph does not fit. Sentence-sized blocks let the copy
        # continue naturally on the following texture while keeping paragraph
        # spacing only after the final sentence.
        parts = [part for part in re.split(r"(?<=[。；！？])", text) if part]
        if len(parts) == 1:
            output.append(("body", parts[0]))
        else:
            for index, part in enumerate(parts):
                if index == 0:
                    part_kind = "body_start"
                elif index == len(parts) - 1:
                    part_kind = "body_end"
                else:
                    part_kind = "body_cont"
                output.append((part_kind, part))
    return output


def block_metrics(draw, block, base_size, width):
    kind, text = block
    size = {"title": base_size + 12, "h2": base_size + 5, "h3": base_size + 2}.get(kind, base_size)
    font = face(size)
    line_height = int(size * 1.25)
    lines = wrap_chars(draw, text, font, width)
    before = 8 if kind in {"h2", "h3"} else 0
    after = 7 if kind in {"title", "h2", "h3"} else (4 if kind in {"body", "body_end", "meta"} else 0)
    return lines, font, line_height, before, after


def paginate_blocks(markdown: str, specs: tuple[PageAsset, ...], base_size: int):
    blocks = flow_blocks(markdown)
    page_blocks: list[list[tuple[str, str]]] = [[] for _ in specs]
    used = [0 for _ in specs]
    first_width, first_height = specs[0].size
    first_margin = 48 if first_height > 700 else 38
    estimate_draw = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    estimated_total = 0
    for block in blocks:
        lines, _, line_height, before, after = block_metrics(
            estimate_draw, block, base_size, first_width - first_margin * 2,
        )
        estimated_total += before + len(lines) * line_height + after
    capacities = [spec.size[1] - (60 if spec.size[1] > 700 else 32) for spec in specs]
    target_ratio = min(0.98, estimated_total / sum(capacities))
    page = 0
    for block in blocks:
        while True:
            if page >= len(specs):
                return None
            width, height = specs[page].size
            margin_x = 48 if height > 700 else 38
            margin_y = 30 if height > 700 else 16
            probe = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
            lines, _, line_height, before, after = block_metrics(
                probe, block, base_size, width - margin_x * 2,
            )
            block_height = before + len(lines) * line_height + after
            capacity = height - margin_y * 2
            target = capacity * target_ratio
            soft_break = (
                page < len(specs) - 1
                and bool(page_blocks[page])
                and block[0] not in {"body_cont", "body_end"}
                and used[page] >= target * 0.65
                and abs(used[page] - target) < abs(used[page] + block_height - target)
            )
            if used[page] + block_height <= capacity and not soft_break:
                page_blocks[page].append(block)
                used[page] += block_height
                break
            # Never strand a heading as the final item of a page.
            if page_blocks[page] and page_blocks[page][-1][0] in {"h2", "h3"}:
                heading = page_blocks[page].pop()
                heading_lines, _, heading_height, hb, ha = block_metrics(
                    probe, heading, base_size, width - margin_x * 2,
                )
                used[page] -= hb + len(heading_lines) * heading_height + ha
                page += 1
                if page >= len(specs):
                    return None
                page_blocks[page].append(heading)
                next_width, next_height = specs[page].size
                next_margin = 48 if next_height > 700 else 38
                next_probe = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
                hl, _, hh, hbb, haa = block_metrics(
                    next_probe, heading, base_size, next_width - next_margin * 2,
                )
                used[page] = hbb + len(hl) * hh + haa
                continue
            if not page_blocks[page]:
                return None
            page += 1
    if page != len(specs) - 1 or any(not content for content in page_blocks):
        return None
    return page_blocks, used


def render_flow_page(blocks, size, base_size):
    width, height = size
    margin_x = 48 if height > 700 else 38
    margin_y = 30 if height > 700 else 16
    max_width = width - margin_x * 2
    image = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    y = margin_y
    for block in blocks:
        kind, _ = block
        lines, font, line_height, before, after = block_metrics(draw, block, base_size, max_width)
        y += before
        color = "#6f2e13" if kind in {"title", "h2", "h3"} else "#533521"
        for line in lines:
            if kind == "title":
                box = draw.textbbox((0, 0), line, font=font)
                x = (width - (box[2] - box[0])) / 2
            else:
                x = margin_x
            draw.text((x, y), line, font=font, fill=color)
            y += line_height
        y += after
    if y > height - margin_y + 2:
        raise ValueError(f"flow legal page overflow: {size}, used {y}px")
    return image


def wrap_chars(draw: ImageDraw.ImageDraw, text: str, font, width: int) -> list[str]:
    if not text:
        return [""]
    output: list[str] = []
    current = ""
    current_width = 0.0
    for char in text:
        char_width = draw.textlength(char, font=font)
        if current and current_width + char_width > width:
            output.append(current)
            current = char
            current_width = char_width
        else:
            current += char
            current_width += char_width
    if current:
        output.append(current)
    return output


def measure(draw, content, base_size, width):
    total = 0
    for kind, text in content:
        size = {"title": base_size + 13, "h2": base_size + 6, "h3": base_size + 2}.get(kind, base_size)
        font = face(size)
        if kind == "blank":
            total += max(7, base_size // 2)
            continue
        line_height = int(size * 1.48)
        total += len(wrap_chars(draw, text, font, width)) * line_height
        if kind in {"title", "h2", "h3"}:
            total += max(4, base_size // 3)
    return total


def render_page(markdown: str, size: tuple[int, int]) -> Image.Image:
    width, height = size
    margin_x = 48 if height > 700 else 38
    margin_y = 40 if height > 700 else 18
    max_width = width - margin_x * 2
    content = logical_lines(markdown)
    probe = ImageDraw.Draw(Image.new("RGBA", size))
    chosen = 18
    for base_size in range(29, 17, -1):
        if measure(probe, content, base_size, max_width) <= height - margin_y * 2:
            chosen = base_size
            break

    image = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    y = margin_y
    for kind, text in content:
        if kind == "blank":
            y += max(7, chosen // 2)
            continue
        font_size = {"title": chosen + 13, "h2": chosen + 6, "h3": chosen + 2}.get(kind, chosen)
        font = face(font_size)
        color = "#6f2e13" if kind in {"title", "h2", "h3"} else "#533521"
        line_height = int(font_size * 1.48)
        wrapped = wrap_chars(draw, text, font, max_width)
        for line in wrapped:
            if kind == "title":
                box = draw.textbbox((0, 0), line, font=font)
                x = (width - (box[2] - box[0])) / 2
            else:
                x = margin_x
            draw.text((x, y), line, font=font, fill=color)
            y += line_height
        if kind in {"title", "h2", "h3"}:
            y += max(4, chosen // 3)
    if y > height - margin_y + 2:
        raise ValueError(f"legal page overflow: {size}, used {y}px")
    return image


def markdown_html(markdown: str, title: str) -> str:
    body: list[str] = []
    list_open = False
    for raw in markdown.replace("<!-- page -->", "").splitlines():
        text = raw.strip()
        bullet = re.match(r"^[-*]\s+(.+)$", text)
        if bullet:
            if not list_open:
                body.append("<ul>")
                list_open = True
            body.append(f"<li>{linkify(bullet.group(1))}</li>")
            continue
        if list_open:
            body.append("</ul>")
            list_open = False
        if not text:
            continue
        heading = re.match(r"^(#{1,3})\s+(.+)$", text)
        if heading:
            level = len(heading.group(1))
            body.append(f"<h{level}>{linkify(heading.group(2))}</h{level}>")
        else:
            body.append(f"<p>{linkify(text)}</p>")
    if list_open:
        body.append("</ul>")
    content = "\n".join(body)
    return f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}</title><style>
:root{{color-scheme:light}}body{{margin:0;background:#f5f1e9;color:#38271c;font:16px/1.85 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}}
main{{box-sizing:border-box;max-width:860px;margin:30px auto;padding:42px 48px;background:#fffdf8;border:1px solid #eadcc8;border-radius:16px;box-shadow:0 8px 28px #4b2d1814}}
h1{{text-align:center;color:#743417;font-size:30px;margin:0 0 18px}}h2{{color:#743417;border-top:1px solid #eadcc8;padding-top:14px;margin:24px 0 10px}}h3{{color:#8d4a29;margin:18px 0 8px}}p{{text-align:justify;margin:.55em 0}}li{{text-align:justify;margin:.25em 0}}ul{{margin:.55em 0;padding-left:1.5em}}a{{color:#8b3f1d;word-break:break-all}}@media(max-width:680px){{main{{margin:0;padding:24px 20px;border:0;border-radius:0}}h1{{font-size:25px}}}}
</style></head><body><main>{content}</main></body></html>'''


def linkify(text: str) -> str:
    safe = escape(text.replace("**", "").replace("`", ""))
    return re.sub(r"(https?://[^\s）<]+)", r'<a href="\1" rel="noopener noreferrer">\1</a>', safe)


def save_optimized(image: Image.Image, target: Path):
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, optimize=True, compress_level=9)


def render_document(source: Path, specs: tuple[PageAsset, ...]):
    markdown = source.read_text("utf-8")
    document_pages = pages(markdown)
    if len(document_pages) != len(specs):
        raise ValueError(f"{source.name} requires {len(specs)} pages, got {len(document_pages)}")
    # The legacy privacy dialog has an unusually short final texture. Keep the
    # final contact/update section on it, while reflowing all preceding content
    # across the normal-height pages.
    short_last = specs[-1].size[1] < 700
    main_markdown = "\n\n".join(document_pages[:-1]) if short_last else markdown
    main_specs = specs[:-1] if short_last else specs
    layout = None
    selected_size = None
    for base_size in range(42, 17, -1):
        candidate = paginate_blocks(main_markdown, main_specs, base_size)
        if candidate:
            layout = candidate
            selected_size = base_size
            break
    if not layout:
        raise ValueError(f"cannot paginate {source.name}")
    page_blocks, used = layout
    sizes = [selected_size] * len(main_specs)
    if short_last:
        last_layout = None
        last_size = None
        for base_size in range(selected_size, 17, -1):
            candidate = paginate_blocks(document_pages[-1], (specs[-1],), base_size)
            if candidate:
                last_layout = candidate
                last_size = base_size
                break
        if not last_layout:
            raise ValueError(f"cannot paginate final page of {source.name}")
        last_blocks, last_used = last_layout
        page_blocks += last_blocks
        used += last_used
        sizes.append(last_size)
    fills = [used[i] / (spec.size[1] - (60 if spec.size[1] > 700 else 32))
             for i, spec in enumerate(specs)]
    print(f"{source.name}: {len(specs)} pages, font {min(sizes)}–{max(sizes)}, "
          f"fill {min(fills):.0%}–{max(fills):.0%}")
    for content, spec, base_size in zip(page_blocks, specs, sizes):
        image = render_flow_page(content, spec.size, base_size)
        save_optimized(image, CLIENT / spec.filename)
        save_optimized(image, LEGACY / f"{spec.uuid}.png")


def rebuild_legacy_atlas(base_atlas: Path | None):
    """Keep login controls in the atlas header and replace its policy tail."""
    if not base_atlas or not base_atlas.exists():
        return
    atlas = Image.open(base_atlas).convert("RGBA")
    page = Image.open(CLIENT / "agreement_sec_desc15.png").convert("RGBA")
    draw = ImageDraw.Draw(atlas)
    draw.rectangle((0, 100, atlas.width, atlas.height), fill=(0, 0, 0, 0))
    fitted = page.resize((min(page.width, atlas.width), atlas.height - 100), Image.Resampling.LANCZOS)
    atlas.alpha_composite(fitted, ((atlas.width - fitted.width) // 2, 100))
    save_optimized(atlas, LEGACY / "1f821cda2.png")


def generate_legal_assets(base_atlas: Path | None = None):
    LEGACY.mkdir(parents=True, exist_ok=True)
    render_document(LEGAL / "user-agreement.md", USER_PAGES)
    render_document(LEGAL / "privacy-policy.md", PRIVACY_PAGES)
    rebuild_legacy_atlas(base_atlas)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    for source, filename, title in (
        (LEGAL / "user-agreement.md", "user-agreement.html", "潜江干瞪眼用户协议"),
        (LEGAL / "privacy-policy.md", "privacy-policy.html", "潜江干瞪眼隐私政策"),
    ):
        (PUBLIC / filename).write_text(markdown_html(source.read_text("utf-8"), title), "utf-8")


if __name__ == "__main__":
    existing = LEGACY / "1f821cda2.png"
    backup = None
    if existing.exists():
        backup = ROOT / ".tmp-legal-atlas.png"
        shutil.copy2(existing, backup)
    try:
        generate_legal_assets(backup)
    finally:
        if backup and backup.exists():
            backup.unlink()
    print("generated legal textures and HTML")
