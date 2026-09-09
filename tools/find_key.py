#!/usr/bin/env python3
"""
Recovers the XXTEA script key from the reference APK's native library.

Cocos calls jsb_set_xxtea_key("<key>") during startup. On arm64 the literal is
loaded with an ADRP/ADD pair, so we locate every BL to that symbol and decode
the page-relative address computations just before it.
"""
import struct
import sys

PATH = sys.argv[1] if len(sys.argv) > 1 else '/tmp/qjqp/extracted/lib/arm64-v8a/libcocos2djs.so'
data = open(PATH, 'rb').read()

assert data[:4] == b'\x7fELF', 'not an ELF'
is64 = data[4] == 2
assert is64, 'expected 64-bit'

e_shoff, = struct.unpack_from('<Q', data, 0x28)
e_shentsize, e_shnum, e_shstrndx = struct.unpack_from('<HHH', data, 0x3a)

sections = []
for i in range(e_shnum):
    off = e_shoff + i * e_shentsize
    name_off, sh_type, sh_flags, sh_addr, sh_offset, sh_size, sh_link, sh_info, sh_align, sh_entsize = struct.unpack_from(
        '<IIQQQQIIQQ', data, off
    )
    sections.append(dict(name_off=name_off, type=sh_type, addr=sh_addr, offset=sh_offset,
                         size=sh_size, link=sh_link, entsize=sh_entsize))

shstr = sections[e_shstrndx]


def cstr(buf, off):
    end = buf.index(b'\x00', off)
    return buf[off:end].decode('utf-8', 'replace')


for s in sections:
    s['name'] = cstr(data, shstr['offset'] + s['name_off'])

by_name = {s['name']: s for s in sections}
print('sections:', ', '.join(n for n in by_name if n))

# ---- symbols
SYMBOL = '_Z17jsb_set_xxtea_keyRKNSt6__ndk112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE'
target_addr = None
symbols = {}
for secname in ('.symtab', '.dynsym'):
    sec = by_name.get(secname)
    if not sec:
        continue
    strtab = sections[sec['link']]
    n = sec['size'] // 24
    for i in range(n):
        off = sec['offset'] + i * 24
        st_name, st_info, st_other, st_shndx, st_value, st_size = struct.unpack_from('<IBBHQQ', data, off)
        if st_name == 0:
            continue
        nm = cstr(data, strtab['offset'] + st_name)
        if st_value:
            symbols.setdefault(nm, st_value)
        if nm == SYMBOL and st_value:
            target_addr = st_value
    if target_addr:
        print(f'found {secname} entry for jsb_set_xxtea_key @ 0x{target_addr:x}')
        break

text = by_name['.text']
tdata = data[text['offset']:text['offset'] + text['size']]


def addr_to_bytes(addr, length=64):
    for s in sections:
        if s['addr'] and s['addr'] <= addr < s['addr'] + s['size'] and s['type'] != 8:
            off = s['offset'] + (addr - s['addr'])
            return data[off:off + length]
    return None


def read_cstr(addr, maxlen=128):
    b = addr_to_bytes(addr, maxlen)
    if not b:
        return None
    if b'\x00' in b:
        b = b[:b.index(b'\x00')]
    try:
        t = b.decode('utf-8')
    except UnicodeDecodeError:
        return None
    return t


def decode_adrp_add(buf, base_addr, start_idx, count=40):
    """Collect string addresses formed by ADRP(+ADD) in the window before start_idx."""
    out = []
    pages = {}
    lo = max(0, start_idx - count)
    for i in range(lo, start_idx + 1):
        insn, = struct.unpack_from('<I', buf, i * 4)
        pc = base_addr + i * 4
        top = (insn >> 24) & 0x9F
        if top == 0x90:  # ADRP
            rd = insn & 0x1F
            immlo = (insn >> 29) & 0x3
            immhi = (insn >> 5) & 0x7FFFF
            imm = (immhi << 2) | immlo
            if imm & (1 << 20):
                imm -= 1 << 21
            pages[rd] = (pc & ~0xFFF) + (imm << 12)
        elif (insn >> 24) & 0xFF == 0x91:  # ADD Xd, Xn, #imm
            rd = insn & 0x1F
            rn = (insn >> 5) & 0x1F
            imm12 = (insn >> 10) & 0xFFF
            sh = (insn >> 22) & 0x1
            if rn in pages:
                val = pages[rn] + (imm12 << (12 if sh else 0))
                out.append(val)
                pages[rd] = val
    return out


if target_addr is None:
    print('symbol not found; scanning for the string heuristically')
    sys.exit(1)

# ---- PLT stub for the symbol (aarch64: 32-byte PLT0 header, then 16 bytes each)
plt = by_name.get('.plt')
relaplt = by_name.get('.rela.plt')
dynsym = by_name['.dynsym']
dynstr = sections[dynsym['link']]
stub_addr = None
if plt and relaplt:
    count = relaplt['size'] // 24
    for i in range(count):
        off = relaplt['offset'] + i * 24
        r_offset, r_info, r_addend = struct.unpack_from('<QQq', data, off)
        sym_idx = r_info >> 32
        soff = dynsym['offset'] + sym_idx * 24
        st_name, = struct.unpack_from('<I', data, soff)
        nm = cstr(data, dynstr['offset'] + st_name)
        if nm == SYMBOL:
            stub_addr = plt['addr'] + 32 + i * 16
            print(f'PLT stub for symbol @ 0x{stub_addr:x} (reloc #{i})')
            break

targets = {target_addr}
if stub_addr:
    targets.add(stub_addr)

# ---- find BL sites targeting the symbol (directly or via PLT)
found = []
n = len(tdata) // 4
for i in range(n):
    insn, = struct.unpack_from('<I', tdata, i * 4)
    if (insn >> 26) != 0b100101:  # BL
        continue
    imm26 = insn & 0x3FFFFFF
    if imm26 & (1 << 25):
        imm26 -= 1 << 26
    pc = text['addr'] + i * 4
    dest = pc + imm26 * 4
    if dest in targets:
        found.append(i)

print(f'BL call sites to jsb_set_xxtea_key: {len(found)}')
candidates = []
for idx in found:
    addrs = decode_adrp_add(tdata, text['addr'], idx)
    for a in addrs:
        s = read_cstr(a)
        if s and 1 <= len(s) <= 64 and all(32 <= ord(c) < 127 for c in s):
            candidates.append(s)
    print(f'  site @ 0x{text["addr"] + idx * 4:x} -> {[read_cstr(a) for a in addrs]}')

print('\ncandidate keys:', candidates)
with open('/tmp/qjqp/key_candidates.txt', 'w') as f:
    f.write('\n'.join(candidates))
