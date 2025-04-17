import { useState } from "react";

function Items({materials, standardSetups}) {
  if (materials.length === 0) {
    return "";
  };
  if (standardSetups.length === 0) {
    return "";
  };
  const [itemName, setItemName] = useState("");
  const [materialName, setMaterialName] = useState(materials[0].name);
  const [gramsPerUnit, setGramsPerUnit] = useState(0);
  const [setups, setSetups] = useState([blankSetup()]);

  const material = materials.find(m => m.name === materialName);
  const costPerUnit = gramsPerUnit * material.effectiveCost / 1000;
  const unitLength = gramsPerUnit / material.weightPerMm;

  const setupsSum = setups.map(s => s.cost).reduce((acc, cost) => acc+cost, 0);

  const materialSelectOptions = materials.map(m => {
     return <option value={m.name}>{m.name}</option>;
  });

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
    setSetups(nextSetups);
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

  const setupsLoopFrag = setups.map((s, i) => {
    const customSetupNameInputFrag = <input
      name="customName"
      value={s.customName}
      onChange={(e) => handleSetupCustomNameInput(e.target.value, i)}
      style={{width: "150px"}}
    />
    return <>
      &nbsp; &nbsp; &nbsp;
      {s.isCustom ? customSetupNameInputFrag : standardSetupSelectFrag(i)}
      <input
        type="checkbox"
        name="isCustomSetupNameCheckbox"
        checked={s.isCustom}
        onChange={() => handleSetupCustomNameCheckbox(i)}
      />
      <input
        name="setupCost"
        value={s.cost}
        onChange={(e) => handleSetupCostChange(e.target.value, i)}
      />
      <br/>
    </>
  });

  function blankSetup() {
    return {
      standardName: standardSetups[0].name,
      customName: "",
      custom: false,
      cost: 0,
    };
  };

  function addSetup() {
    setSetups(setups.concat([blankSetup()]));
  }

  return (
   <>
    <h1>Items page</h1>

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

    <label>Setup costs:</label><br/>
    {setupsLoopFrag}
    &nbsp; &nbsp; &nbsp;
    <button type="button" onClick={addSetup}> + </button>
    &nbsp; &nbsp; &nbsp;
    <label style={{width: "150px"}}>Total:</label><label>{setupsSum}</label>
   </>
  );
}

export default Items;
