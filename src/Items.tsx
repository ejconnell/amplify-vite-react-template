import { useState } from "react";
import ItemSetups from "./ItemSetups"
import ItemInHouses from "./ItemInHouses"
import ItemWastage from "./ItemWastage"
import ItemOverhead from "./ItemOverhead"
import { MaterialModel } from "./Materials"
import { ItemSetupsModel } from "./ItemSetups"
import { ItemInHousesModel } from "./ItemInHouses"
import { ItemWastageModel, ItemWastageStartingRange } from "./ItemWastage"
import { ItemOverheadModel, ItemOverheadStartingRange } from "./ItemOverhead"

class ItemModel {
  constructor(materials, metals, inHouses, materialName, gramsPerUnit, itemSetups, itemInHouses) {
//debugger
    const material = materials.find(m => m.name === materialName);
    if (!material) return;
    const materialModel = new MaterialModel(metals, material.metalName, material.shapeName, material.width, material.innerWidth, material.rawCost, material.markup);
    const itemSetupsModel = new ItemSetupsModel(itemSetups);
    const itemInHousesModel = new ItemInHousesModel(inHouses, itemInHouses);
    this.materialCostPerUnit = gramsPerUnit * materialModel.effectiveCost / 1000;
    this.unitLength = gramsPerUnit / materialModel.weightPerMm;
    this.setupCostPerJob = itemSetupsModel.totalCostPerJob;
    this.inHouseCostPerUnit = itemInHousesModel.totalCostPerUnit;
  }
}

function Items({items, materials, metals, standardSetups, inHouses, saveItem}) {
  const [exampleQuantity, setExampleQuantity] = useState(300);
  const [itemName, setItemName] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [gramsPerUnit, setGramsPerUnit] = useState(0);
  const [itemSetups, setItemSetups] = useState([]);
  const [itemInHouses, setItemInHouses] = useState([]);
  const [itemWastageRanges, setItemWastageRanges] = useState([ItemWastageStartingRange()]);
  const [itemOverheadRanges, setItemOverheadRanges] = useState([ItemOverheadStartingRange()]);

  const itemModel = new ItemModel(materials, metals, inHouses, materialName, Number(gramsPerUnit), itemSetups, itemInHouses);

  const itemsModels = items.map(item => {
    return new ItemModel(materials, metals, inHouses, item.materialName, item.gramsPerUnit, item.itemSetups, item.itemInHouses);
  });

  const itemRowsFrag = items.map((item, i) => {
    return <tr key={item.name}>
      <td>{item.name}</td>
      <td>{item.materialName}</td>
      <td>{itemsModels[i].materialCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].inHouseCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].setupCostPerJob.toFixed(2)}</td>
      <td></td>
    </tr>
  });
  const materialSelectOptions = materials.map(m => {
     return <option value={m.name} key={m.name}>{m.name}</option>;
  });

  function handleSaveItem() {
    console.log("handleSaveItem()");
    const item = {
      name: itemName,
      materialName: materialName,
      gramsPerUnit: gramsPerUnit,
      itemSetups: itemSetups,
      itemInHouses: itemInHouses,
    };
    console.log(JSON.stringify(item, (k, v) => v === undefined ? "AAAA" : v));
    saveItem(item);
  }

  return (
   <>
    <h1>Items page</h1>

    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
          <th>Metal</th>
          <th>Material per Unit</th>
          <th>In House per Unit</th>
          <th>Setup per Job</th>
          <th>View/Edit</th>
        </tr>
      </thead>
      <tbody>
        {itemRowsFrag}
      </tbody>
    </table>

    <label>Item Name:</label>
    <input
      value={itemName}
      onChange={(e) => setItemName(e.target.value)}
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
    <label>Grams per Unit:</label>
    <input
      value={gramsPerUnit}
      onChange={(e) => setGramsPerUnit(e.target.value)}
    />
    &nbsp;
    <label>Cost per Unit: {itemModel.materialCostPerUnit?.toFixed(4)}</label>
    &nbsp;
    <label>Unit Length (mm): {itemModel.unitLength?.toFixed(4)}</label>
    <br/>

    <ItemSetups
      standardSetups={standardSetups}
      itemSetups={itemSetups}
      setItemSetups={setItemSetups}
    />

    <ItemInHouses
      inHouses={inHouses}
      itemInHouses={itemInHouses}
      setItemInHouses={setItemInHouses}
    />

    <ItemWastage
      itemWastageRanges={itemWastageRanges}
      exampleQuantity={exampleQuantity}
      setItemWastageRanges={setItemWastageRanges}
    />

    <ItemOverhead
      itemOverheadRanges={itemOverheadRanges}
      exampleQuantity={exampleQuantity}
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
