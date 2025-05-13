export const deepCopy = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    // 如果不是对象类型，直接返回
    return obj;
  }

  // 创建一个新的对象或数组，根据原始对象的类型
  const copy = Array.isArray(obj) ? [] : {};

  // 遍历原始对象的每个属性或元素，并递归地进行拷贝
  for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          copy[key] = deepCopy(obj[key]);
      }
  }

  return copy;
};
