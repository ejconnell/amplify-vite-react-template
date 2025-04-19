import { useState } from "react";
import ItemSetups from "./ItemSetups"
import ItemInHouses from "./ItemInHouses"

class ItemModel {
  constructor(materials, materialName, gramsPerUnit) {
    const material = materials.find(m => m.name === materialName);
    this.costPerUnit = gramsPerUnit * material.effectiveCost / 1000;
    this.unitLength = gramsPerUnit / material.weightPerMm;
  }
}

function Items({items, materials, standardSetups, inHouses, addItem}) {
  const [itemName, setItemName] = useState("");
  const [materialName, setMaterialName] = useState(materials[0].name);
  const [gramsPerUnit, setGramsPerUnit] = useState(0);
  const [itemSetups, setItemSetups] = useState([{isCustom:false}]);
  const [itemInHouses, setItemInHouses] = useState([{}]);

  const itemModel = new ItemModel(materials, materialName, gramsPerUnit);

  const itemRowsFrag = items.map(item => {
    return <tr>
      <td>{item.name}</td>
      <td>{item.materialName}</td>
      <td>{JSON.stringify(item.itemSetups, (k, v) => v === undefined ? "AAAA" : v)}</td>
      <td>{JSON.stringify(item.itemInHouses, (k, v) => v === undefined ? "AAAA" : v)}</td>
    </tr>
  });
  const materialSelectOptions = materials.map(m => {
     return <option value={m.name}>{m.name}</option>;
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
    addItem(item);
  }

  return (
   <>
    <h1>Items page</h1>

    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
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
      {materialSelectOptions}
    </select>
    &nbsp;
    <label>Grams per Unit:</label>
    <input
      value={gramsPerUnit}
      onChange={(e) => setGramsPerUnit(parseFloat(e.target.value))}
    />
    &nbsp;
    <label>Cost per Unit: {itemModel.costPerUnit.toFixed(4)}</label>
    &nbsp;
    <label>Unit Length (mm): {itemModel.unitLength.toFixed(4)}</label>
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

    <button type="submit" onClick={handleSaveItem}>
      Add Item
    </button>
   </>
  );
}

export default Items;
