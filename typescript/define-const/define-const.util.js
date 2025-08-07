function deepFreeze(obj) {
  // Handle primitives and null
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // Handle arrays and objects
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = obj[prop];
    if (typeof value === "object" && value !== null) {
      deepFreeze(value);
    }
  });

  return Object.freeze(obj);
}

function defineConst(obj) {
  return deepFreeze(obj);
}

module.exports = { deepFreeze, defineConst };
// export { deepFreeze, defineConst };
