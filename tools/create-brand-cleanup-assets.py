#!/usr/bin/env python3
"""Generate replacement artwork for legacy branded APK resources.

The source directory must contain decrypted Cocos raw assets. Generated files are
checked into assets/branding/legacy-cleanup so normal APK builds do not depend on
this script or Pillow.
"""
from pathlib import Path
import argparse
import shutil

from PIL import Image, ImageDraw, ImageFont
from legal_assets import generate_legal_assets


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "branding" / "legacy-cleanup"
FONT = next(path for path in (
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
) if Path(path).exists())


def font(size, index=0):
    return ImageFont.truetype(FONT, size=size, index=index)


def centered(draw, box, text, face, fill):
    bounds = draw.textbbox((0, 0), text, font=face)
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    x0, y0, x1, y1 = box
    draw.text(((x0 + x1 - width) / 2, (y0 + y1 - height) / 2 - bounds[1]), text, font=face, fill=fill)


def wrap(draw, text, face, max_width):
    lines = []
    for paragraph in text.split("\n"):
        current = ""
        for char in paragraph:
            trial = current + char
            if current and draw.textlength(trial, font=face) > max_width:
                lines.append(current)
                current = char
            else:
                current = trial
        lines.append(current)
    return lines


def paragraph(draw, xy, text, face, fill, max_width, spacing=12):
    x, y = xy
    line_height = face.size + spacing
    for line in wrap(draw, text, face, max_width):
        draw.text((x, y), line, font=face, fill=fill)
        y += line_height
    return y


def save(img, relative):
    target = OUTPUT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.suffix.lower() in {".jpg", ".jpeg"}:
        img.convert("RGB").save(target, quality=94, subsampling=0)
    else:
        img.save(target, optimize=True)


def make_order_help():
    img = Image.new("RGBA", (467, 424), "white")
    d = ImageDraw.Draw(img)
    centered(d, (0, 24, 467, 76), "充值订单示例", font(30), "#333333")
    d.rounded_rectangle((45, 105, 422, 321), 18, fill="#f7f7f7", outline="#df3c32", width=5)
    d.rounded_rectangle((70, 145, 397, 281), 12, fill="white", outline="#dddddd", width=2)
    d.text((92, 167), "潜江干瞪眼的充值订单", font=font(20), fill="#333333")
    d.text((92, 208), "购买房卡后，请点击支付", font=font(17), fill="#666666")
    centered(d, (0, 340, 467, 395), "请核对订单名称后完成付款", font(18), "#666666")
    save(img, "02dd5217-a089-4edb-af79-6e1c1f3e8f35.png")


def make_anticheat():
    img = Image.new("RGBA", (919, 522), "#2b1838")
    d = ImageDraw.Draw(img)
    for i in range(9):
        d.ellipse((40 + i * 108, 385 - (i % 2) * 22, 92 + i * 108, 437 - (i % 2) * 22), fill="#f2c04e")
    centered(d, (0, 48, 919, 150), "外挂悬赏", font(70), "#ff6b35")
    centered(d, (0, 155, 919, 220), "官方承诺 · 坚决打击作弊", font(34), "#ffe7a3")
    centered(d, (70, 238, 849, 330), "发现并举报外挂，经核实后将予以奖励", font(28), "white")
    centered(d, (0, 448, 919, 500), "潜江干瞪眼运营团队", font(24), "#f8ddb0")
    save(img, "1b3339a9-7323-4d7a-bc29-a0541f03ebc0.png")


def make_gambling_notice():
    img = Image.new("RGB", (966, 560), "#0d584a")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((28, 26, 938, 534), 22, outline="#8bd5b5", width=4)
    centered(d, (0, 48, 966, 126), "禁赌声明", font(52), "white")
    body = (
        "本游戏仅供亲朋好友之间休闲娱乐。游戏积分仅用于记录对局成绩，不具备货币价值；"
        "房卡仅为游戏道具，不提供回购、兑换现金或实物服务。\n"
        "严禁利用本游戏实施赌博、作弊或其他违法行为。一经核实，将视情节采取限制账号、"
        "封禁账号等措施；涉嫌违法犯罪的，将依法向有关机关报告。"
    )
    paragraph(d, (95, 155), body, font(26), "white", 776, 16)
    d.text((594, 485), "潜江干瞪眼运营团队", font=font(22), fill="#d8f5e8")
    save(img, "352ea258-16a5-4785-9a93-7dcd168211b4.jpg")


def make_responsible_banner():
    img = Image.new("RGBA", (994, 567), "#a84225")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((25, 25, 969, 542), 26, outline="#f1a46c", width=7)
    centered(d, (0, 100, 994, 205), "仅供娱乐  严禁赌博", font(55), "white")
    centered(d, (0, 228, 994, 300), "提倡绿色健康游戏", font(34), "#ffe1bd")
    centered(d, (0, 350, 994, 420), "违规举报请联系游戏内官方客服", font(28), "white")
    save(img, "7b0ebbdf-d404-42ab-9c8e-85ad2b828ae9.png")


def make_public_notice():
    img = Image.new("RGBA", (966, 1000), "#fff8ec")
    d = ImageDraw.Draw(img)
    d.rectangle((45, 38, 921, 962), outline="#bc2830", width=8)
    centered(d, (0, 80, 966, 170), "公告", font(62), "#191919")
    body = (
        "为维护文明、健康的游戏环境，本应用将持续对游戏内容和运营行为进行自查。\n"
        "潜江干瞪眼是一款供亲朋好友休闲交流的游戏。游戏中的积分仅用于记录对局结果，"
        "不具备货币属性，严禁任何赌博、作弊以及其他违法违规行为。\n"
        "对违反用户协议和游戏规则的账号，我们将根据违规程度采取警告、限制或封禁措施。"
        "请各位玩家自觉遵守规则，共同维护公平、健康的游戏环境。"
    )
    paragraph(d, (100, 215), body, font(30), "#3d3328", 766, 20)
    centered(d, (90, 720, 876, 795), "严重违规处理名单", font(34), "#a5222c")
    d.line((130, 820, 836, 820), fill="#d9b7a0", width=3)
    d.text((610, 900), "潜江干瞪眼运营团队", font=font(24), fill="#685347")
    save(img, "c8f530ab-040c-4919-b8c6-fa74703c8b06.png")


def make_green_notice():
    img = Image.new("RGBA", (965, 592), "#f5fbf1")
    d = ImageDraw.Draw(img)
    for x, y, r in [(45, 58, 28), (105, 30, 17), (850, 62, 34), (910, 115, 20), (65, 510, 25)]:
        d.ellipse((x-r, y-r, x+r, y+r), fill="#b9dfaa")
    centered(d, (0, 68, 965, 175), "绿色游戏  禁止赌博", font(58), "#19814a")
    body = (
        "潜江干瞪眼为玩家提供文明健康的休闲娱乐平台，坚决抵制低俗、赌博、作弊等违法违规行为。\n"
        "请广大玩家共同监督，合理安排游戏时间，享受健康生活。"
    )
    paragraph(d, (160, 230), body, font(29), "#285c3d", 645, 18)
    d.text((650, 520), "潜江干瞪眼运营团队", font=font(22), fill="#397453")
    save(img, "f80f7e41-3748-4fee-99cf-8066229ff1aa.png")


def clean_sprite_atlases(source):
    login = Image.open(source / "1d" / "1d602e4c2.png").convert("RGBA")
    ImageDraw.Draw(login).rectangle((535, 600, 615, 705), fill=(0, 0, 0, 0))
    save(login, "1d602e4c2.png")

    wheel = Image.open(source / "73" / "735a1b69-bef3-4257-9942-773def542b50.png").convert("RGBA")
    d = ImageDraw.Draw(wheel)
    d.rectangle((0, 650, 620, 770), fill=(0, 0, 0, 0))
    d.text((28, 680), "官方客服请以游戏内公告为准", font=font(30), fill="white", stroke_width=2, stroke_fill="#1d1d1d")
    save(wheel, "735a1b69-bef3-4257-9942-773def542b50.png")


def replace_old_icon():
    icon = Image.open(ROOT / "assets" / "branding" / "icon.png").convert("RGB")
    icon = icon.resize((128, 128), Image.Resampling.LANCZOS)
    save(icon, "9272ef06-deee-4241-b004-64c282072754.jpg")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="decrypted assets/res/raw-assets directory")
    args = parser.parse_args()
    if not args.source.is_dir():
        raise SystemExit(f"source directory not found: {args.source}")
    shutil.rmtree(OUTPUT, ignore_errors=True)
    OUTPUT.mkdir(parents=True)
    make_order_help()
    make_anticheat()
    make_gambling_notice()
    make_responsible_banner()
    make_public_notice()
    make_green_notice()
    generate_legal_assets(args.source / "1f" / "1f821cda2.png")
    clean_sprite_atlases(args.source)
    replace_old_icon()
    print(OUTPUT)


if __name__ == "__main__":
    main()
