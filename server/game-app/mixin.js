/** 把模块里的方法挂到类原型上，属性描述与 class 方法一致（不可枚举）。 */
const mixin = (Target, ...sources) => {
  for (const source of sources) {
    for (const [name, value] of Object.entries(source)) {
      if (Object.prototype.hasOwnProperty.call(Target.prototype, name)) {
        throw new Error(`GameApp 方法重复定义：${name}`);
      }
      Object.defineProperty(Target.prototype, name, { value, writable: true, configurable: true, enumerable: false });
    }
  }
  return Target;
};

module.exports = { mixin };
