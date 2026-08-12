import { describe, expect, it } from "vitest";
import { MaterialModel } from "./MaterialModel";
import { Shapes } from "./Shapes";
import { IMetal } from "./Types";

const metals: IMetal[] = [{
  name: "Brass",
  density: "0.0085",
  metalFamilyName: "Copper alloys",
  latheCostPerThousand: "0",
}];

describe("MaterialModel", () => {
  it("adds both percentage and flat markups to the raw cost", () => {
    const material = new MaterialModel({
      metals,
      metalName: "Brass",
      shapeName: Shapes[0].name,
      width: "2",
      innerWidth: "",
      rawCost: "100",
      markup: "10",
      flatMarkup: "2.50",
    });

    expect(material.effectiveCost).toBe(112.5);
  });

  it("retains the percentage calculation when flat markup is zero", () => {
    const material = new MaterialModel({
      metals,
      metalName: "Brass",
      shapeName: Shapes[0].name,
      width: "2",
      innerWidth: "",
      rawCost: "100",
      markup: "6.5",
      flatMarkup: "0",
    });

    expect(material.effectiveCost).toBe(106.5);
  });
});
