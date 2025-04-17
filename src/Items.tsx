import { useState } from "react";
import ItemInHouses from "./ItemInHouses"

function Items({items, materials, standardSetups, inHouses, addItem}) {
  if (materials.length === 0) {
    return "";
  };
  if (standardSetups.length === 0) {
    return "";
  };
  if (inHouses.length === 0) {
    return "";
  };
  const [itemName, setItemName] = useState("");
  const [materialName, setMaterialName] = useState(materials[0].name);
  const [gramsPerUnit, setGramsPerUnit] = useState(0);
  const [setups, setSetups] = useState([blankSetup()]);
  const [itemInHouses, setItemInHouses] = useState([{}]);

  const material = materials.find(m => m.name === materialName);
  const costPerUnit = gramsPerUnit * material.effectiveCost / 1000;
  const unitLength = gramsPerUnit / material.weightPerMm;

  const setupsSum = setups.map(s => s.cost).reduce((acc, cost) => acc+cost, 0);

  //debugger
  const itemRowsFrag = items.map(item => {
    return <tr>
      <td>{item.name}</td>
      <td>{item.materialName}</td>
      <td>{JSON.stringify(item.setups)}</td>
      <td>{JSON.stringify(item.itemInHouses)}</td>
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
      setups: setups,
      itemInHouses: itemInHouses,
    };
    addItem(item);
  }

  function handleSetupStandardNameSelect(value, index) {
    console.log("handleSetupStandardNameSelect()");
    const nextSetups = setups.map((s, i) => {
      if (i === index) {
        return {
          standardName: value,
          customName: s.customName,
          isCustom: s.isCustom,
          cost: s.cost,
        }
      } else {
        return {...s};
      };
    });
    console.log(JSON.stringify(nextSetups));
    setSetups(nextSetups);
  }

  function handleSetupCustomNameInput(value, index) {
    console.log("handleSetupStandardNameSelect()");
    const nextSetups = setups.map((s, i) => {
      if (i === index) {
        return {
          standardName: s.standardName,
          customName: value,
          isCustom: s.isCustom,
          cost: s.cost,
        }
      } else {
        return {...s};
      };
    });
    console.log(JSON.stringify(nextSetups));
    setSetups(nextSetups);
  }

  function handleSetupCustomNameCheckbox(index) {
    console.log("AAA 1")
    const nextSetups = setups.map((s, i) => {
      if (i === index) {
        return {
          standardName: s.standardName,
          customName: s.customName,
          isCustom: !s.isCustom,
          cost: s.cost,
        }
      } else {
        return {...s};
      };
    });
    console.log("AAA 2")
    setSetups(nextSetups);
    console.log("AAA 3")
  }

  function handleSetupCostChange(value, index) {
    const nextSetups = setups.map((s, i) => {
      if (i === index) {
        return {
          standardName: s.standardName,
          customName: s.customName,
          isCustom: s.isCustom,
          cost: parseFloat(value),
        }
      } else {
        return {...s};
      };
    });
    setSetups(nextSetups);
  }

  function addSetup(index) {
    const nextSetups = [
      ...setups.slice(0, index+1),
      blankSetup(),
      ...setups.slice(index+1),
    ];
    setSetups(nextSetups);
  }

  function deleteSetup(index) {
    if (setups.length === 1) return;
    const nextSetups = [
      ...setups.slice(0, index),
      ...setups.slice(index+1),
    ];
    setSetups(nextSetups);
  }

  function standardSetupSelectFrag(i) {
    const standardSetupsSelectOptions = standardSetups.map(ss => {
      return <option value={ss.name}>{ss.name}</option>;
    });
    return <>
      <select
        value={setups[i].standardName}
        onChange={e => handleSetupStandardNameSelect(e.target.value, i)}
        style={{width: "157px"}}
      >
        {standardSetupsSelectOptions}
      </select>
    </>;
  };

  const setupsRowsFrag = setups.map((s, i) => {
    const setupCustomNameInputFrag = <input
      name="customName"
      value={s.customName}
      onChange={(e) => handleSetupCustomNameInput(e.target.value, i)}
      style={{width: "150px"}}
    />
    return <>
      <tr>
      <td>
        {s.isCustom ? setupCustomNameInputFrag : standardSetupSelectFrag(i)}
        <input
          type="checkbox"
          name="isSetupCustomNameCheckbox"
          checked={s.isCustom}
          onChange={() => handleSetupCustomNameCheckbox(i)}
        />
      </td>
      <td><input
        name="setupCost"
        value={s.cost}
        onChange={(e) => handleSetupCostChange(e.target.value, i)}
      /></td>
      <td><button type="button" onClick={() => deleteSetup(i)}> - </button></td>
      <td><button type="button" onClick={() => addSetup(i)}> + </button></td>
      </tr>
    </>
  });
  const setupsTotalRowFrag = <tr>
    <td><b>Total</b></td>
    <td><b>{setupsSum}</b></td>
  </tr>

  function blankSetup() {
    return {
      standardName: standardSetups[0].name,
      customName: "",
      isCustom: false,
      cost: 0,
    };
  };

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
    <label>Cost per Unit: {costPerUnit.toFixed(4)}</label>
    &nbsp;
    <label>Unit Length (mm): {unitLength.toFixed(4)}</label>
    <br/>

    <h3>Setup:</h3>
    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name (check box for custom)</th>
          <th>Cost</th>
          <th>Delete</th>
          <th>Add</th>
        </tr>
      </thead>
      <tbody>
        {setupsRowsFrag}
        {setupsTotalRowFrag}
      </tbody>
    </table>

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
