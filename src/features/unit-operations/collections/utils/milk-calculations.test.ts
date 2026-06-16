import { describe, it, expect } from "vitest";
import { calculateSnfPercentage, calculateKg } from "./milk-calculations";

describe("milk-calculations", () => {
  describe("calculateSnfPercentage", () => {
    it("calculates SNF percentage correctly based on fat and clr", () => {
      // Formula: ((CLR + Fat) / 4) + 0.44
      // ((28 + 4) / 4) + 0.44 = (32 / 4) + 0.44 = 8 + 0.44 = 8.44
      expect(calculateSnfPercentage(4, 28)).toBe(8.44);
    });

    it("returns 0 if fat or clr is missing", () => {
      expect(calculateSnfPercentage(0, 28)).toBe(0);
      expect(calculateSnfPercentage(4, 0)).toBe(0);
    });

    it("rounds to 2 decimal places", () => {
      // ((28.5 + 4.1) / 4) + 0.44 = (32.6 / 4) + 0.44 = 8.15 + 0.44 = 8.59
      expect(calculateSnfPercentage(4.1, 28.5)).toBe(8.59);
    });
  });

  describe("calculateKg", () => {
    it("calculates KG correctly based on quantity and percentage", () => {
      // Formula: (Quantity * Percentage) / 100
      // (10 * 4) / 100 = 0.4
      expect(calculateKg(10, 4)).toBe(0.4);
    });

    it("returns 0 if quantity or percentage is missing", () => {
      expect(calculateKg(0, 4)).toBe(0);
      expect(calculateKg(10, 0)).toBe(0);
    });

    it("rounds to 3 decimal places", () => {
      // (10.123 * 4.56) / 100 = 46.160868 / 100 = 0.46160868 -> 0.462
      expect(calculateKg(10.123, 4.56)).toBe(0.462);
    });
  });
});
