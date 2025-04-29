import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import ItemSetups from "./ItemSetups"
import ItemInHouses from "./ItemInHouses"
import ItemWastage from "./ItemWastage"
import ItemOverhead from "./ItemOverhead"
import ItemOutsourcings from "./ItemOutsourcings"
import Labels from "./Labels"
import { MaterialModel } from "./Materials"
import { ItemSetupsModel } from "./ItemSetups"
import { ItemInHousesModel } from "./ItemInHouses"
import { ItemWastageModel, ItemWastageInitialRange } from "./ItemWastage"
import { ItemOverheadModel, ItemOverheadInitialRange } from "./ItemOverhead"
import { ItemOutsourcingsModel } from "./ItemOutsourcings"

export class ItemModel {
  constructor({materials, metals, inHouses, outsourcings, materialName, unitLength, itemSetups=[], itemInHouses=[], itemWastageRanges=[], itemOverheadRanges=[], itemOutsourcings=[], unitQuantity}) {
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
  const [itemWastageRanges, setItemWastageRanges] = useState([ItemWastageInitialRange()]);
  const [itemOverheadRanges, setItemOverheadRanges] = useState([ItemOverheadInitialRange()]);
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

  const allItemsFrag = (<>
    <label>{Labels.exampleUnitQuantity.chinese} Example unit quantity:</label>
    <input
      value={exampleUnitQuantity}
      onChange={(e) => setExampleUnitQuantity(e.target.value)}
    />
    <br/>
    <br/>

    <Table bordered striped>
      <thead>
        <tr>
          <th>{Labels.name.chinese} Name</th>
          <th>{Labels.material.chinese}{Labels.name.chinese} Material name</th>
          <th>{Labels.material.chinese}{Labels.cost.chinese} Material cost</th>
          <th>{Labels.inHouse.chinese}{Labels.cost.chinese} In House cost</th>
          <th>{Labels.outsourcing.chinese}{Labels.cost.chinese} Outsourcing cost</th>
          <th>{Labels.wastage.chinese} Wastage percent</th>
          <th>{Labels.setupCost.chinese} Setup cost</th>
          <th>{Labels.overhead.chinese} Overhead percent</th>
          <th>{Labels.load.chinese} Load</th>
        </tr>
      </thead>
      <tbody>
        {itemRowsFrag}
      </tbody>
    </Table>
  </>);

  const currentItemFrag = (<>
    <label>{Labels.name.chinese} Name:</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <br/>

    <h4>{Labels.material.chinese} Material:</h4>
    <select
      value={materialName}
      onChange={e => setMaterialName(e.target.value)}
    >
      <option value="" key="blank"></option>;
      {materialSelectOptions}
    </select>
    &nbsp;
    <label>{Labels.unit.chinese}{Labels.length.chinese} Unit length (mm):</label>
    <input
      value={unitLength}
      onChange={(e) => setUnitLength(e.target.value)}
    />
    <br/>
    <label>{Labels.cost.chinese}/{Labels.unit.chinese}Cost per unit: {itemModel.materialCostPerUnit.toFixed(4)}</label>
    <br/>
    <label>{Labels.gram.chinese}/{Labels.unit.chinese}Grams per unit: {itemModel.gramsPerUnit.toFixed(4)}</label>
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
  </>);

  const importerInstructionsText = `This importer works for a single item at a time.
It doesn't 'save' the item directly; it only 'loads' it
to the "Current Item" section for you to review, then add
the 'name' field based on Google Sheet tab name, and then
click "Save Item".

In Google Sheets go to an Item tab, click on cell P46
and drag back to cell A1.  Copy and then paste the
whole thing here.
  `;

  function importerProcessorFunc(grid) {
    const materialNames = materials.map(m => m.name);
    const standardSetupNames = standardSetups.map(m => m.name);
    const inHouseNames = inHouses.map(m => m.name);
    const outsourcingNames = outsourcings.map(m => m.name);

    let numErrors = 0;
    const MaxErrors = 2;
    if (grid.length !== 46) {
      doAlert(`Import aborted. Expected exactly 46 rows but got ${grid.length}`);
      return;
    }
    console.log(grid);
    function doAlert(str) {
      if (numErrors < MaxErrors) {
        if (numErrors < MaxErrors - 1) {
          alert(str);
        } else {
          alert(str + " - Additional errors will be ignored");
        }
      }
      numErrors += 1;
    }
    grid.forEach((row, i) => {
      if (row.length !== 16) {
        doAlert(`Import failed on row ${i+1}.  Expected exactly 16 columns but got ${row.length}`);
        return;
      }
    });
    const materialName = grid[1][0];
    if (materialNames.includes(materialName)) {
      setMaterialName(materialName);
    } else {
      setMaterialName(materialName.replace("-", " "));
    }

    const unitLength = grid[3][13];
    setUnitLength(unitLength);

    const itemSetups = [];
    for (let row = 2; row <= 7; row++) {
      const standardSetupName = grid[row][5];
      const costPerJob = grid[row][6];
      if (!standardSetupName) continue;
      if (standardSetupName === "空白") continue;  // "unused"
      if (!standardSetupNames.includes(standardSetupName)) {
        doAlert(`Standard setup name '${standardSetupName}' not found on row ${row+1}`);
        continue;
      }
      itemSetups.push({
        key: crypto.randomUUID(),
        standardName: standardSetupName,
        customName: "",
        isCustomName: false,
        costPerJob: costPerJob,
      });
    }
    for (let row = 10; row <= 15; row++) {
      const customSetupName = grid[row][5];
      const costPerJob = grid[row][6];
      if (!customSetupName) continue;
      itemSetups.push({
        key: crypto.randomUUID(),
        standardName: "",
        customName: customSetupName,
        isCustomName: true,
        costPerJob: costPerJob,
      });
    }
    setItemSetups(itemSetups);

    const itemInHouses = [];
    for (let row = 4; row <= 15; row++) {
      //const inHouseName = grid[row][0];
      const inHouseName = grid[row][0].replace("\n", "").trim();
      if (!inHouseName) continue;
      if (inHouseName === "空白") continue;  // "unused"
      if (!inHouseNames.includes(inHouseName)) {
        doAlert(`In house name '${inHouseName}' not found on row ${row+1}`);
        continue;
      }
      itemInHouses.push({
        key: crypto.randomUUID(),
        name: inHouseName,
        quantity: grid[row][2],
      });
    }
    setItemInHouses(itemInHouses);

    const itemWastageRanges = [];
    let nextEnding = ItemWastageInitialRange().ending;
    for (let row = 21; row <= 30; row++) {
      const starting = grid[row][0];
      const value = grid[row][1];
      if (!starting) continue;
      itemWastageRanges.push({
        key: crypto.randomUUID(),
        starting: starting,
        ending: nextEnding,
        value: value,
      });
      nextEnding = starting - 1;
    }
    if (nextEnding >= 0) {
      itemWastageRanges.push({
        key: crypto.randomUUID(),
        starting: 0,
        ending: nextEnding,
        value: 1000000,
      });
    }
    setItemWastageRanges(itemWastageRanges);

    const itemOverheadRanges = [];
    nextEnding = ItemOverheadInitialRange().ending;
    for (let row = 21; row <= 30; row++) {
      const starting = grid[row][3];
      const value = grid[row][4];
      if (!starting) continue;
      itemOverheadRanges.push({
        key: crypto.randomUUID(),
        starting: starting,
        ending: nextEnding,
        value: value,
      });
      nextEnding = starting - 1;
    }
    if (nextEnding >= 0) {
      itemOverheadRanges.push({
        key: crypto.randomUUID(),
        starting: 0,
        ending: nextEnding,
        value: 1000000,
      });
    }
    setItemOverheadRanges(itemOverheadRanges);

    const itemOutsourcings = []
    for (let row = 36; row <= 45; row++) {
      const outsourcingName = grid[row][0];
      const gramsPerUnit = grid[row][1];
      if (!outsourcingName) continue;
      if (outsourcingName.trim() === "空白 unused") continue;
      if (!outsourcingNames.includes(outsourcingName)) {
        doAlert(`Outsourcing name '${outsourcingName}' not found on row ${row+1}`);
        continue;
      }
      itemOutsourcings.push({
        key: crypto.randomUUID(),
        name: outsourcingName,
        gramsPerUnit: gramsPerUnit,
      });
    }
    setItemOutsourcings(itemOutsourcings);
  }

  const administrationFrag = (<>
    <Importer
      instructionsText={importerInstructionsText}
      buttonText="Load to Current Item"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (
    <Trifold
      top={allItemsFrag}
      middle={currentItemFrag}
      bottom={administrationFrag}
      label={Labels.item}
    />
  );

}

export default Items;
