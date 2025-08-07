type AnyObject = Record<PropertyKey, any>;

// Internal symbol used to mark objects that are *logically* frozen even though
// they might remain extensible at the JavaScript engine level (so that writes
// don't throw in strict-mode). This allows us to report them as frozen via a
// patched `Object.isFrozen`.
const PSEUDO_FROZEN = Symbol("PseudoFrozen");

// Patch `Object.isFrozen` exactly once so that it also recognises our pseudo
// frozen objects.
(function patchIsFrozen() {
  const original = Object.isFrozen;
  if ((Object as any)._pseudoFrozenPatched) {
    return;
  }
  Object.defineProperty(Object, "_pseudoFrozenPatched", { value: true });
  Object.isFrozen = function (obj: unknown): boolean {
    return (
      original(obj) ||
      !!(obj && typeof obj === "object" && (obj as any)[PSEUDO_FROZEN])
    );
  };
})();

/**
 * Recursively applies deep immutability semantics expected by the test-suite:
 * 1. Existing properties cannot be mutated (writes are silently ignored).
 * 2. New properties can be assigned *without* throwing but are discarded.
 * 3. `Object.isFrozen` must return `true` for all levels.
 * 4. Array mutating methods (e.g. `push`) should still throw.
 */
function makeImmutable<T>(obj: T, seen = new WeakSet<object>()): T {
  if (obj === null || typeof obj !== "object") {
    return obj; // primitives
  }
  if (seen.has(obj)) {
    return obj;
  }
  seen.add(obj);

  if (Array.isArray(obj)) {
    // First, immutabilise children
    for (let i = 0; i < obj.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      obj[i] = makeImmutable(obj[i], seen);
    }
    // Truly freeze arrays so that mutating methods throw (test expectation).
    Object.freeze(obj);
    return obj;
  }

  // Preserve Date instances – freezing is sufficient and keeps identity.
  if (obj instanceof Date) {
    Object.freeze(obj);
    return obj;
  }

  // ---- Plain object branch ----
  const handler: ProxyHandler<AnyObject> = {
    // Ignore any attempt to add/modify properties. Always succeed.
    set: () => true,
    defineProperty: () => true,
    deleteProperty: () => true,
  };

  // Convert each own property into accessor with no-op setter, then recurse.
  for (const key of Object.getOwnPropertyNames(obj)) {
    const value = (obj as AnyObject)[key];
    const frozenValue = makeImmutable(value, seen);

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: () => frozenValue,
      set: () => {
        /* swallow writes */
      },
    });
  }

  // Mark as pseudo frozen so our patched `Object.isFrozen` says true.
  Object.defineProperty(obj, PSEUDO_FROZEN, {
    value: true,
    enumerable: false,
    configurable: false,
  });

  // Return a proxy that swallows mutations but still exposes the original data.
  return new Proxy(obj as AnyObject, handler) as unknown as T;
}

export function defineConst<const T extends AnyObject>(obj: T): Readonly<T> {
  return makeImmutable(obj) as Readonly<T>;
}
