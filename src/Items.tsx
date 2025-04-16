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

  const materialSelectOptions = materials.map(m => {
     return <option value={m.name}>{m.name}</option>;
  });

  function handleStandardSetupSelect(value, index) {
    const nextSetups = setups.map((s, i) => {
      if (i === index) {
        return {
          name: value,
          custom: s.custom,
          cost: s.cost,
        }
      } else {
        return s;
      };
    });
    setSetups(nextSetups);
  }

  function handleCustomSetupNameCheckbox(index) {
    console.log("XXXXX")
    const nextSetups = setups.map((s, i) => {
      if (i === index) {
        return {
          name: s.name,
          custom: !s.custom,
          cost: s.cost,
        }
      } else {
        return s;
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
        value={setups[i].name}
        onChange={e => handleStandardSetupSelect(e.target.value, i)}
      >
        {standardSetupsSelectOptions}
      </select>
    </>;
  };

  const setupsFrag = setups.map((s, i) => {
    const manualSetupNameInputFrag = <input
      name="name"
      value={s.name}
      onChange={(e) => handleStandardSetupSelect(e.target.value, i)}
    />
    return <>
      <label>{s.name}</label><br/>
      {s.custom ? manualSetupNameInputFrag : standardSetupSelectFrag(i)}
      <input
        type="checkbox"
        name="isCustomSetupNameCheckbox"
        checked={s.custom}
        onChange={() => handleCustomSetupNameCheckbox(i)}
      />
      <br/>
    </>
  });

  function blankSetup() {
    return {
      name: standardSetups[0].name,
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

    <label>Setups:</label><br/>
    {setupsFrag}
    <button type="button" onClick={addSetup}> + </button>
   </>
  );
}

export default Items;
