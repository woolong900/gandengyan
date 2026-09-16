const fs = require('fs');

const LC_SEGMENT_64 = 0x19;
const LC_LOAD_DYLIB = 0x0c;
const MH_MAGIC_64 = 0xfeedfacf;

const align8 = (value) => (value + 7) & ~7;

const injectMachOLoadDylib = (file, installName) => {
  const binary = fs.readFileSync(file);
  if (binary.readUInt32LE(0) !== MH_MAGIC_64) throw new Error('仅支持小端 64 位 Mach-O');
  const commandCount = binary.readUInt32LE(16);
  const commandsSize = binary.readUInt32LE(20);
  let offset = 32;
  let firstSectionOffset = binary.length;
  for (let index = 0; index < commandCount; index += 1) {
    const command = binary.readUInt32LE(offset);
    const commandSize = binary.readUInt32LE(offset + 4);
    if (commandSize < 8 || offset + commandSize > binary.length) throw new Error('Mach-O load command 损坏');
    if (command === LC_LOAD_DYLIB) {
      const nameOffset = binary.readUInt32LE(offset + 8);
      const end = binary.indexOf(0, offset + nameOffset);
      if (end > 0 && binary.toString('utf8', offset + nameOffset, end) === installName) return false;
    }
    if (command === LC_SEGMENT_64) {
      const sections = binary.readUInt32LE(offset + 64);
      let sectionOffset = offset + 72;
      for (let section = 0; section < sections; section += 1, sectionOffset += 80) {
        const fileOffset = binary.readUInt32LE(sectionOffset + 48);
        if (fileOffset > 0) firstSectionOffset = Math.min(firstSectionOffset, fileOffset);
      }
    }
    offset += commandSize;
  }
  if (offset !== 32 + commandsSize) throw new Error('Mach-O sizeofcmds 与 load commands 不一致');

  const name = Buffer.from(`${installName}\0`, 'utf8');
  const commandSize = align8(24 + name.length);
  if (offset + commandSize > firstSectionOffset) throw new Error('Mach-O 头部没有足够空间写入动态库命令');
  const command = Buffer.alloc(commandSize);
  command.writeUInt32LE(LC_LOAD_DYLIB, 0);
  command.writeUInt32LE(commandSize, 4);
  command.writeUInt32LE(24, 8);
  command.writeUInt32LE(0, 12);
  command.writeUInt32LE(0x10000, 16);
  command.writeUInt32LE(0x10000, 20);
  name.copy(command, 24);
  command.copy(binary, offset);
  binary.writeUInt32LE(commandCount + 1, 16);
  binary.writeUInt32LE(commandsSize + commandSize, 20);
  fs.writeFileSync(file, binary);
  return true;
};

module.exports = { injectMachOLoadDylib };
