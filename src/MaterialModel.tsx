import { IShape, Shapes } from "./Shapes";
import { IMetal } from "./Types";

export class MaterialModel {
  width: number;
  innerWidth: number;
  rawCost: number;
  markup: number;
  autoName: string;
  density: number;
  hasInnerWidth: boolean;
  widthLabel: string;
  chineseWidth: string;
  crossSectionArea: number;
  weightPerMm: number;
  effectiveCost: number;
  constructor({ metals, metalName, shapeName, width, innerWidth, rawCost, markup }:{metals: IMetal[], metalName: string, shapeName: string, width: string, innerWidth: string, rawCost: string, markup: string}) {
    this.width = Number(width);
    this.innerWidth = Number(innerWidth);
    this.rawCost = Number(rawCost);
    this.markup = Number(markup);
    const metal = metals.find(m => m.name === metalName);
    const shape = Shapes.find(s => s.name === shapeName);

    this.autoName = this.buildAutoName(metalName, shape, this.width, this.innerWidth);
    this.density = Number(metal?.density);
    this.hasInnerWidth = shape?.hasInnerWidth || false;
    this.widthLabel = shape?.widthLabel || "-";
    this.chineseWidth = shape?.chineseWidth || "";
    this.crossSectionArea = width === "" ? Number.NaN : Number(shape?.area(this.width, this.innerWidth));
    this.weightPerMm = this.density * this.crossSectionArea;
    this.effectiveCost = rawCost === "" ? Number.NaN : this.rawCost + (this.rawCost * this.markup / 100);
  }

  buildAutoName(metalName: string, shape: IShape | undefined, width: number, innerWidth: number) {
    if (!metalName) return "---";
    let str = `${metalName} ${Number(width).toFixed(1)}`;
    if (!shape) return str;
    if (shape.hasInnerWidth) {
      str += `-${Number(innerWidth).toFixed(1)}`;
    }
    str += "mm";
    if (shape.abbreviation) {
      str += ` ${shape.abbreviation}`;
    }
    return str;
  }
}
