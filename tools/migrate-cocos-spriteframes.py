#!/usr/bin/env python3
"""Restore packed SpriteFrames to their logical resources paths."""
import hashlib
import json
import os
import sys
from pathlib import Path
from PIL import Image

project = Path(sys.argv[1]).resolve()
mapping = json.loads(Path(sys.argv[2]).read_text())
assets = project / 'assets' / 'resources'
atlas_root = assets / '_RecoveredDependencies' / 'Textures'

frames = {}
meta_files = list(atlas_root.glob('*.png.meta'))
for meta_path in meta_files:
    try:
        data = json.loads(meta_path.read_text())
    except Exception:
        continue
    for name, frame in data.get('subMetas', {}).items():
        frames[frame.get('uuid')] = (meta_path, data, name, frame)

def stable_uuid(value):
    h = hashlib.sha1(value.encode()).hexdigest()[:32]
    return f'{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:]}'

created = 0
existing = 0
missing = []
dirty = {}
for item in mapping:
    uuid = item['uuid']
    source = frames.get(uuid)
    if not source:
        continue
    meta_path, atlas_meta, name, frame = source
    base = assets / item['logical']
    candidates = [base.with_suffix(ext) for ext in ('.png', '.jpg', '.jpeg')]
    target = next((p for p in candidates if p.exists() and p.with_name(p.name + '.meta').exists() and uuid in p.with_name(p.name + '.meta').read_text()), None)
    if target:
        existing += 1
    else:
        target = base.with_suffix('.png')
        atlas = Image.open(str(meta_path)[:-5]).convert('RGBA')
        x, y = int(frame['trimX']), int(frame['trimY'])
        width, height = int(frame['width']), int(frame['height'])
        if frame.get('rotated'):
            crop = atlas.crop((x, y, x + height, y + width)).transpose(Image.Transpose.ROTATE_90)
        else:
            crop = atlas.crop((x, y, x + width, y + height))
        raw_width = max(width, int(frame.get('rawWidth') or width))
        raw_height = max(height, int(frame.get('rawHeight') or height))
        left = round((raw_width - width) / 2 + float(frame.get('offsetX') or 0))
        top = round((raw_height - height) / 2 - float(frame.get('offsetY') or 0))
        canvas = Image.new('RGBA', (raw_width, raw_height), (0, 0, 0, 0))
        canvas.alpha_composite(crop, (left, top))
        target.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(target)
        texture_uuid = stable_uuid('migrated-texture:' + uuid)
        sub = dict(frame)
        sub.update({'rawTextureUuid': texture_uuid, 'trimX': left, 'trimY': top, 'rotated': False})
        output_meta = {
            'ver': '2.2.0', 'uuid': texture_uuid, 'type': 'texture',
            'wrapMode': 'clamp', 'filterMode': 'bilinear', 'premultiplyAlpha': False,
            'subMetas': {target.stem: sub},
        }
        target.with_name(target.name + '.meta').write_text(json.dumps(output_meta, ensure_ascii=False, indent=2) + '\n')
        created += 1
    atlas_meta.get('subMetas', {}).pop(name, None)
    dirty[meta_path] = atlas_meta

for meta_path, data in dirty.items():
    meta_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

print(f'场景资源路径已迁移：新建 {created}，复用 {existing}，隐藏图集解除 {created + existing}。')
