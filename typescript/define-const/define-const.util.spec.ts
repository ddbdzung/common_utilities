import { defineConst } from "./define-const.util"; // Adjust import path as needed

describe("defineConst with deepFreeze", () => {
  // Basic functionality
  it("should return object with same properties and values", () => {
    const input = { PENDING: "pending", PROCESSING: "processing" };
    const result = defineConst(input);

    expect(result).toEqual(input);
    expect(result.PENDING).toBe("pending");
    expect(result.PROCESSING).toBe("processing");
  });

  // Deep freeze verification
  it("should deeply freeze nested objects", () => {
    const input = {
      LEVEL1: {
        LEVEL2: {
          LEVEL3: {
            value: "deep",
          },
        },
        array: [{ nested: "item" }],
      },
    };

    const result = defineConst(input);

    // All levels should be frozen
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.LEVEL1)).toBe(true);
    expect(Object.isFrozen(result.LEVEL1.LEVEL2)).toBe(true);
    expect(Object.isFrozen(result.LEVEL1.LEVEL2.LEVEL3)).toBe(true);
    expect(Object.isFrozen(result.LEVEL1.array)).toBe(true);
    expect(Object.isFrozen(result.LEVEL1.array[0])).toBe(true);

    // Modifications should fail
    expect(() => {
      result.LEVEL1.LEVEL2.LEVEL3.value = "modified";
    }).not.toThrow();
    expect(result.LEVEL1.LEVEL2.LEVEL3.value).toBe("deep");
  });

  // Array handling
  it("should freeze arrays and their elements", () => {
    const input = {
      SIMPLE_ARRAY: [1, 2, 3],
      OBJECT_ARRAY: [{ id: 1 }, { id: 2 }],
      NESTED_ARRAY: [
        [1, 2],
        [3, 4],
      ],
    };

    const result = defineConst(input);

    expect(Object.isFrozen(result.SIMPLE_ARRAY)).toBe(true);
    expect(Object.isFrozen(result.OBJECT_ARRAY)).toBe(true);
    expect(Object.isFrozen(result.OBJECT_ARRAY[0])).toBe(true);
    expect(Object.isFrozen(result.NESTED_ARRAY)).toBe(true);
    expect(Object.isFrozen(result.NESTED_ARRAY[0])).toBe(true);
  });

  // Primitive types
  it("should handle primitive values correctly", () => {
    const input = {
      STRING: "text",
      NUMBER: 42,
      BOOLEAN: true,
      NULL: null,
      UNDEFINED: undefined,
    };

    const result = defineConst(input);

    expect(result.STRING).toBe("text");
    expect(result.NUMBER).toBe(42);
    expect(result.BOOLEAN).toBe(true);
    expect(result.NULL).toBe(null);
    expect(result.UNDEFINED).toBe(undefined);
    expect(Object.isFrozen(result)).toBe(true);
  });

  // Empty objects and arrays
  it("should handle empty objects and arrays", () => {
    const input = {
      EMPTY_OBJECT: {},
      EMPTY_ARRAY: [],
    };

    const result = defineConst(input);

    expect(Object.isFrozen(result.EMPTY_OBJECT)).toBe(true);
    expect(Object.isFrozen(result.EMPTY_ARRAY)).toBe(true);
  });

  // Circular reference protection
  it("should handle objects with circular references", () => {
    const input: any = { name: "root" };
    input.self = input; // Circular reference

    expect(() => defineConst(input)).not.toThrow();

    const result = defineConst({ safe: "value" });
    expect(Object.isFrozen(result)).toBe(true);
  });

  // Date objects
  it("should freeze Date objects", () => {
    const date = new Date();
    const input = { CREATED_AT: date };

    const result = defineConst(input);

    expect(Object.isFrozen(result.CREATED_AT)).toBe(true);
    expect(result.CREATED_AT).toBe(date);
  });

  // Function properties
  it("should freeze objects with function properties", () => {
    const input = {
      HANDLER: () => "test",
      NESTED: {
        method: function () {
          return "nested";
        },
      },
    };

    const result = defineConst(input);

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.NESTED)).toBe(true);
    expect(result.HANDLER()).toBe("test");
    expect(result.NESTED.method()).toBe("nested");
  });

  // Immutability enforcement
  it("should prevent all forms of mutation", () => {
    const result = defineConst({
      LEVEL1: {
        value: "original",
        array: [1, 2, { nested: "value" }],
      },
    });

    // Property assignment
    expect(() => {
      (result as any).NEW_PROP = "new";
    }).not.toThrow();
    expect((result as any).NEW_PROP).toBeUndefined();

    // Nested property assignment
    expect(() => {
      result.LEVEL1.value = "modified";
    }).not.toThrow();
    expect(result.LEVEL1.value).toBe("original");

    // Array modification
    expect(() => {
      result.LEVEL1.array.push(4);
    }).toThrow(); // Arrays throw when frozen

    // Nested object in array
    expect(() => {
      (result.LEVEL1.array[2] as any).nested = "modified";
    }).not.toThrow();
    expect((result.LEVEL1.array[2] as any).nested).toBe("value");

    // Property deletion
    expect(() => {
      delete (result as any).LEVEL1;
    }).not.toThrow();
    expect(result.LEVEL1).toBeDefined();
  });

  // Type preservation
  it("should preserve literal types with const assertion", () => {
    const STATUS = defineConst({
      PENDING: "pending",
      PROCESSING: "processing",
      COMPLETED: "completed",
    } as const);

    expect(STATUS.PENDING).toBe("pending");
    expect(Object.keys(STATUS)).toEqual(["PENDING", "PROCESSING", "COMPLETED"]);
  });

  // Real-world usage pattern
  it("should work with status constants pattern", () => {
    const RFM_SYNC_STATUS = defineConst({
      PENDING: "pending",
      PROCESSING: "processing",
      EMITTED: "emitted",
      METADATA: {
        version: "1.0",
        allowedTransitions: {
          pending: ["processing"],
          processing: ["emitted"],
        },
      },
    });

    type RfmSyncStatus = (typeof RFM_SYNC_STATUS)[keyof typeof RFM_SYNC_STATUS];

    // Verify deep freeze
    expect(Object.isFrozen(RFM_SYNC_STATUS)).toBe(true);
    expect(Object.isFrozen(RFM_SYNC_STATUS.METADATA)).toBe(true);
    expect(Object.isFrozen(RFM_SYNC_STATUS.METADATA.allowedTransitions)).toBe(
      true
    );

    // Verify values
    expect(RFM_SYNC_STATUS.PENDING).toBe("pending");
    expect(RFM_SYNC_STATUS.METADATA.version).toBe("1.0");

    // Test type usage
    const status: RfmSyncStatus = RFM_SYNC_STATUS.PENDING;
    expect(status).toBe("pending");
  });

  // Performance with moderately large objects
  it("should handle reasonably large objects", () => {
    const largeObject: Record<string, any> = {};
    for (let i = 0; i < 100; i++) {
      largeObject[`PROP_${i}`] = {
        value: i,
        nested: { deep: `value_${i}` },
      };
    }

    const start = performance.now();
    const result = defineConst(largeObject);
    const end = performance.now();

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.PROP_50.nested)).toBe(true);
    expect(end - start).toBeLessThan(100); // Should complete in reasonable time
  });

  // Performance stress-test with 10k, 50k, 100k keys
  const perfMatrix: Array<{ size: number; maxMs: number }> = [
    { size: 10_000, maxMs: 1_500 },
    { size: 50_000, maxMs: 5_000 },
    { size: 100_000, maxMs: 12_000 },
    { size: 500_000, maxMs: 20_000 },
  ];

  perfMatrix.forEach(({ size, maxMs }) => {
    it(
      `should freeze plain object with ${size.toLocaleString()} properties within ${maxMs}ms`,
      () => {
        const obj: Record<string, number> = {};
        for (let i = 0; i < size; i++) {
          obj[`K_${i}`] = i;
        }
        const start = performance.now();
        const result = defineConst(obj);
        const duration = performance.now() - start;
        expect(Object.isFrozen(result)).toBe(true);
        expect(duration).toBeLessThan(maxMs);
      },
      maxMs + 5000 // Increase Jest timeout for heavy test
    );
  });
});
