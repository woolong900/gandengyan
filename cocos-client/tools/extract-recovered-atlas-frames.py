#!/usr/bin/env python3
"""Turn recovered packed SpriteFrames into lossless standalone Cocos assets.

The APK stores SpriteFrame rect/original-size data in its compiled import JSON.
Those values cannot be represented reliably as multiple ``custom`` subMetas on
one raw PNG: Creator recalculates every frame as a trim of the whole atlas.
This tool crops each frame, restores its logical canvas, and keeps the original
SpriteFrame UUID on a standalone PNG so existing prefab/scene references remain
valid.
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from PIL import Image


def stable_uuid(value: str) -> str:
    digest = hashlib.sha1(value.encode("utf-8")).hexdigest()[:32]
    return f"{digest[:8]}-{digest[8:12]}-{digest[12:16]}-{digest[16:20]}-{digest[20:]}"


def extract(meta_path: Path, output_root: Path) -> int:
    image_path = Path(str(meta_path)[:-5])
    if not image_path.exists():
        raise FileNotFoundError(f"找不到图集图片：{image_path}")

    atlas_meta = json.loads(meta_path.read_text(encoding="utf-8"))
    frames = list((atlas_meta.get("subMetas") or {}).items())
    if not frames:
        print(f"已跳过无切片图集：{meta_path}")
        return 0

    atlas = Image.open(image_path).convert("RGBA")
    atlas_dir = output_root / image_path.stem
    atlas_dir.mkdir(parents=True, exist_ok=True)

    for name, frame in frames:
        frame_uuid = frame["uuid"]
        x, y = int(frame["trimX"]), int(frame["trimY"])
        width, height = int(frame["width"]), int(frame["height"])

        if frame.get("rotated"):
            crop = atlas.crop((x, y, x + height, y + width)).transpose(
                Image.Transpose.ROTATE_90
            )
        else:
            crop = atlas.crop((x, y, x + width, y + height))

        raw_width = max(width, int(frame.get("rawWidth") or width))
        raw_height = max(height, int(frame.get("rawHeight") or height))
        left = round((raw_width - width) / 2 + float(frame.get("offsetX") or 0))
        top = round((raw_height - height) / 2 - float(frame.get("offsetY") or 0))
        canvas = Image.new("RGBA", (raw_width, raw_height), (0, 0, 0, 0))
        canvas.alpha_composite(crop, (left, top))

        target = atlas_dir / f"{name}.png"
        canvas.save(target)

        texture_uuid = stable_uuid(f"extracted-texture:{frame_uuid}")
        standalone_frame = {
            "ver": "1.0.3",
            "uuid": frame_uuid,
            "rawTextureUuid": texture_uuid,
            "trimType": "custom",
            "trimThreshold": 1,
            "rotated": False,
            "offsetX": 0,
            "offsetY": 0,
            "trimX": 0,
            "trimY": 0,
            "width": raw_width,
            "height": raw_height,
            "rawWidth": raw_width,
            "rawHeight": raw_height,
            "borderTop": int(frame.get("borderTop") or 0),
            "borderBottom": int(frame.get("borderBottom") or 0),
            "borderLeft": int(frame.get("borderLeft") or 0),
            "borderRight": int(frame.get("borderRight") or 0),
            "subMetas": {},
        }
        target_meta = {
            "ver": "2.2.0",
            "uuid": texture_uuid,
            "type": "texture",
            "wrapMode": "clamp",
            "filterMode": "bilinear",
            "premultiplyAlpha": False,
            "subMetas": {target.stem: standalone_frame},
        }
        Path(str(target) + ".meta").write_text(
            json.dumps(target_meta, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    # The raw atlas can stay in the project, but it must stop claiming the same
    # SpriteFrame UUIDs now owned by the standalone assets.
    atlas_meta["subMetas"] = {}
    meta_path.write_text(
        json.dumps(atlas_meta, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"已拆分 {len(frames)} 个切片：{image_path.name} -> {atlas_dir}")
    return len(frames)


def main() -> None:
    if len(sys.argv) < 3:
        raise SystemExit(
            "用法：extract-recovered-atlas-frames.py <输出目录> <图集.png.meta> [...]"
        )
    output_root = Path(sys.argv[1]).resolve()
    total = sum(extract(Path(item).resolve(), output_root) for item in sys.argv[2:])
    print(f"已按 APK 原始尺寸重建 {total} 个 SpriteFrame。")


if __name__ == "__main__":
    main()
