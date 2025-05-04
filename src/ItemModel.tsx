import { ItemInHousesModel } from "./ItemInHouses";
import { ItemOutsourcingsModel } from "./ItemOutsourcings";
import { ItemOverheadModel } from "./ItemOverhead";
import { ItemSetupsModel } from "./ItemSetups";
import { ItemWastageModel } from "./ItemWastage";
import { MaterialModel } from "./MaterialModel";
import { blankMaterial } from "./Materials";
import { IInHouse, IItemInHouse, IItemOutsourcing, IItemOverheadRange, IItemSetup, IItemWastageRange, IMaterial, IMetal, IOutsourcing } from "./Types";


export class ItemModel {
  unitLength: number;
  gramsPerUnit: number;
  materialCostPerUnit: number;
  inHouseCostPerUnit: number;
  outsourcingCostPerUnit: number;
  setupCostPerUnit: number;
  wastagePercent: number;
  overheadPercent: number;
  constructor({ materials, metals, inHouses, outsourcings, materialName, unitLength, itemSetups, itemInHouses, itemWastageRanges, itemOverheadRanges, itemOutsourcings, unitQuantity }:{ materials: IMaterial[], metals: IMetal[], inHouses: IInHouse[], outsourcings: IOutsourcing[], materialName: string, unitLength: number | string, itemSetups: IItemSetup[], itemInHouses: IItemInHouse[], itemWastageRanges: IItemWastageRange[], itemOverheadRanges: IItemOverheadRange[], itemOutsourcings: IItemOutsourcing[], unitQuantity: number }) {
    this.unitLength = Number(unitLength);
    const material = materials.find(m => m.name === materialName) || blankMaterial();
    const materialModel = new MaterialModel({ metals: metals, ...material });
    const itemInHousesModel = new ItemInHousesModel(inHouses, itemInHouses);
    const itemOutsourcingsModel = new ItemOutsourcingsModel(outsourcings, itemOutsourcings, unitQuantity);
    const itemWastageModel = new ItemWastageModel(itemWastageRanges, unitQuantity);
    const itemSetupsModel = new ItemSetupsModel(itemSetups, unitQuantity);
    const itemOverheadModel = new ItemOverheadModel(itemOverheadRanges, unitQuantity);
    this.gramsPerUnit = unitLength === "" ? Number.NaN : this.unitLength * materialModel.weightPerMm;
    this.materialCostPerUnit = this.gramsPerUnit * materialModel.effectiveCost / 1000;
    this.inHouseCostPerUnit = itemInHousesModel.totalCostPerUnit;
    this.outsourcingCostPerUnit = itemOutsourcingsModel.totalCostPerUnit;
    this.wastagePercent = itemWastageModel.value;
    this.setupCostPerUnit = itemSetupsModel.totalCostPerUnit;
    this.overheadPercent = itemOverheadModel.value;
  }
}
