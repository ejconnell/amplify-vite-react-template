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

class ItemModel {
  constructor({materials, metals, inHouses, outsourcings, materialName, gramsPerUnit, itemSetups, itemInHouses, itemWastageRanges, itemOverheadRanges, itemOutsourcings}) {
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

function Items({items, materials, metals, standardSetups, inHouses, outsourcings, saveItem}) {
  const [exampleQuantity, setExampleQuantity] = useState(300);
  const [name, setName] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [gramsPerUnit, setGramsPerUnit] = useState(0);
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
    gramsPerUnit: Number(gramsPerUnit),
    itemSetups: itemSetups,
    itemInHouses: itemInHouses,
    itemWastageRanges: itemWastageRanges,
    itemOverheadRanges: itemOverheadRanges,
    itemOutsourcings: itemOutsourcings,
  });

  const itemsModels = items.map(item => {
    return new ItemModel({...lookupTables, ...item});
  });

  function handleSaveItem() {
    console.log("handleSaveItem()");
    const item = {
      name: name,
      materialName: materialName,
      gramsPerUnit: gramsPerUnit,
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
    setGramsPerUnit(item.gramsPerUnit);
    setItemSetups(item.itemSetups || []);
    setItemInHouses(item.itemInHouses || []);
    setItemWastageRanges(item.itemWastageRanges || [ItemWastageStartingRange()]);
    setItemOverheadRanges(item.itemOverheadRanges || [ItemOverheadStartingRange()]);
    setItemOutsourcings(item.itemOutsourcings || []);
  }

  const itemRowsFrag = items.map((item, i) => {
    return <tr key={item.name}>
      <td>{item.name}</td>
      <td>{item.materialName}</td>
      <td>{itemsModels[i].materialCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].inHouseCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].setupCostPerJob.toFixed(2)}</td>
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

    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
          <th>Metal</th>
          <th>Material per Unit</th>
          <th>In House per Unit</th>
          <th>Setup per Job</th>
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

    <ItemOutsourcings
      outsourcings={outsourcings}
      itemOutsourcings={itemOutsourcings}
      exampleQuantity={exampleQuantity}
      setItemOutsourcings={setItemOutsourcings}
    />

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
