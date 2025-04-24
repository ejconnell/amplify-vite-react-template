import { useState } from "react";
import ItemSetups from "./ItemSetups"
import ItemInHouses from "./ItemInHouses"
import ItemWastage from "./ItemWastage"
import ItemOverhead from "./ItemOverhead"
import ItemOutsourcings from "./ItemOutsourcings"
import { MaterialModel } from "./Materials"
import { ItemSetupsModel } from "./ItemSetups"
import { ItemInHousesModel } from "./ItemInHouses"
import { ItemWastageModel, ItemWastageStartingRange } from "./ItemWastage"
import { ItemOverheadModel, ItemOverheadStartingRange } from "./ItemOverhead"
import { ItemOutsourcingsModel } from "./ItemOutsourcings"

export class ItemModel {
  constructor({materials, metals, inHouses, outsourcings, materialName, unitLength, itemSetups, itemInHouses, itemWastageRanges, itemOverheadRanges, itemOutsourcings, unitQuantity}) {
    const material = materials.find(m => m.name === materialName) || {};
    const materialModel = new MaterialModel({metals: metals, ...material});
    const itemInHousesModel = new ItemInHousesModel(inHouses, itemInHouses);
    const itemOutsourcingsModel = new ItemOutsourcingsModel(outsourcings, itemOutsourcings, unitQuantity);
    const itemWastageModel = new ItemWastageModel(itemWastageRanges, unitQuantity);
    const itemSetupsModel = new ItemSetupsModel(itemSetups, unitQuantity);
    const itemOverheadModel = new ItemOverheadModel(itemOverheadRanges, unitQuantity);
    this.gramsPerUnit = unitLength === "" ? Number.NaN : unitLength * materialModel.weightPerMm;
    this.materialCostPerUnit = this.gramsPerUnit * materialModel.effectiveCost / 1000;
    this.inHouseCostPerUnit = itemInHousesModel.totalCostPerUnit;
    this.outsourcingCostPerUnit = itemOutsourcingsModel.totalCostPerUnit;
    this.wastagePercent = Number(itemWastageModel.value);
    this.setupCostPerUnit = itemSetupsModel.totalCostPerUnit;
    this.overheadPercent = Number(itemOverheadModel.value);
  }
}

function Items({items, materials, metals, standardSetups, inHouses, outsourcings, saveItem}) {
  const [exampleUnitQuantity, setExampleUnitQuantity] = useState(300);
  const [name, setName] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [unitLength, setUnitLength] = useState("");
  const [itemSetups, setItemSetups] = useState([]);
  const [itemInHouses, setItemInHouses] = useState([]);
  const [itemWastageRanges, setItemWastageRanges] = useState([ItemWastageStartingRange()]);
  const [itemOverheadRanges, setItemOverheadRanges] = useState([ItemOverheadStartingRange()]);
  const [itemOutsourcings, setItemOutsourcings] = useState([]);

  const lookupTables = {
    materials: materials,
    metals: metals,
    inHouses: inHouses,
    outsourcings: outsourcings,
  };

  const itemModel = new ItemModel({
    ...lookupTables,
    materialName: materialName,
    unitLength: unitLength,
    itemSetups: itemSetups,
    itemInHouses: itemInHouses,
    itemWastageRanges: itemWastageRanges,
    itemOverheadRanges: itemOverheadRanges,
    itemOutsourcings: itemOutsourcings,
    unitQuantity: exampleUnitQuantity,
  });

  const itemsModels = items.map(item => {
    return new ItemModel({
       ...lookupTables,
       ...item,
       unitQuantity: exampleUnitQuantity,
    });
  });

  function handleSaveItem() {
    console.log("handleSaveItem()");
    if (!name) {
      alert("Need a name");
      return;
    }
    if (!materialName) {
      alert("Need a name");
      return;
    }
    if (isNaN(itemModel.materialCostPerUnit)) {
      alert("Need to fix Material section");
      return;
    }
    if (isNaN(itemModel.inHouseCostPerUnit)) {
      alert("Need to fix In House section");
      return;
    }
    if (isNaN(itemModel.outsourcingCostPerUnit)) {
      alert("Need to fix Outsourcing section");
      return;
    }
    if (isNaN(itemModel.wastagePercent)) {
      alert("Need to fix Wastage section");
      return;
    }
    if (isNaN(itemModel.setupCostPerUnit)) {
      alert("Need to fix Setup section");
      return;
    }
    if (isNaN(itemModel.overheadPercent)) {
      alert("Need to fix Overhead section");
      return;
    }

    const item = {
      name: name,
      materialName: materialName,
      unitLength: unitLength,
      itemSetups: itemSetups,
      itemInHouses: itemInHouses,
      itemWastageRanges: itemWastageRanges,
      itemOverheadRanges: itemOverheadRanges,
      itemOutsourcings: itemOutsourcings,
    };
    console.log(JSON.stringify(item, (k, v) => v === undefined ? "AAAA" : v));
    saveItem(item);
  }

  function handleLoadItem(index) {
    const item = items[index];
    setName(item.name);
    setMaterialName(item.materialName);
    setUnitLength(item.unitLength);
    setItemSetups(item.itemSetups);
    setItemInHouses(item.itemInHouses);
    setItemWastageRanges(item.itemWastageRanges);
    setItemOverheadRanges(item.itemOverheadRanges);
    setItemOutsourcings(item.itemOutsourcings);
  }

  const itemRowsFrag = items.map((item, i) => {
    return <tr key={item.name}>
      <td>{item.name}</td>
      <td>{item.materialName}</td>
      <td>{itemsModels[i].materialCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].inHouseCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].outsourcingCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].wastagePercent.toFixed(2)}</td>
      <td>{itemsModels[i].setupCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].overheadPercent.toFixed(2)}</td>
      <td>
        <button type="button" onClick={() => handleLoadItem(i)}>Load</button>
      </td>
    </tr>
  });
  const materialSelectOptions = materials.map(m => {
     return <option value={m.name} key={m.name}>{m.name}</option>;
  });

  return (
   <>
    <h1>Items page</h1>

    <label>Example unit quantity:</label>
    <input
      value={exampleUnitQuantity}
      onChange={(e) => setExampleUnitQuantity(e.target.value)}
    />
    <br/>
    <br/>

    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
          <th>Metal</th>
          <th>Material cost</th>
          <th>In House cost</th>
          <th>Outsourcing cost</th>
          <th>Wastage percent</th>
          <th>Setup cost</th>
          <th>Overhead percent</th>
          <th>Load</th>
        </tr>
      </thead>
      <tbody>
        {itemRowsFrag}
      </tbody>
    </table>

    <label>Name:</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <br/>

    <label>Material:</label>
    <select
      value={materialName}
      onChange={e => setMaterialName(e.target.value)}
    >
      <option value="" key="blank"></option>;
      {materialSelectOptions}
    </select>
    &nbsp;
    <label>Unit length (mm):</label>
    <input
      value={unitLength}
      onChange={(e) => setUnitLength(e.target.value)}
    />
    &nbsp;
    <label>Cost per Unit: {itemModel.materialCostPerUnit.toFixed(4)}</label>
    &nbsp;
    <label>Grams per unit: {itemModel.gramsPerUnit.toFixed(4)}</label>
    <br/>

    <ItemInHouses
      inHouses={inHouses}
      itemInHouses={itemInHouses}
      setItemInHouses={setItemInHouses}
    />

    <ItemOutsourcings
      outsourcings={outsourcings}
      itemOutsourcings={itemOutsourcings}
      exampleUnitQuantity={exampleUnitQuantity}
      startingGramsPerUnit={itemModel.gramsPerUnit}
      setItemOutsourcings={setItemOutsourcings}
    />

    <ItemWastage
      itemWastageRanges={itemWastageRanges}
      exampleUnitQuantity={exampleUnitQuantity}
      setItemWastageRanges={setItemWastageRanges}
    />

    <ItemSetups
      standardSetups={standardSetups}
      itemSetups={itemSetups}
      setItemSetups={setItemSetups}
      exampleUnitQuantity={exampleUnitQuantity}
    />

    <ItemOverhead
      itemOverheadRanges={itemOverheadRanges}
      exampleUnitQuantity={exampleUnitQuantity}
      setItemOverheadRanges={setItemOverheadRanges}
    />

    <br/>
    <br/>
    <button type="submit" onClick={handleSaveItem}>
      Save Item
    </button>
   </>
  );
}

export default Items;
