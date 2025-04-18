import { useState } from "react";

export class ItemSetupsModel {
  constructor(itemSetups) {
    this.totalJobCost = itemSetups.map(s => s.cost).reduce((acc, cost) => acc+cost, 0);
  }
}

function ItemSetups({standardSetups, itemSetups, setItemSetups}) {
  const isModel = new ItemSetupsModel(itemSetups);

  function handleStandardNameChange(value, index) {
    console.log("handleStandardNameChange()");
    const nextItemSetups = itemSetups.map((s, i) => {
      if (i === index) {
        return {
          standardName: value,
          customName: s.customName || "",
          isCustom: s.isCustom || false,
          cost: s.cost,
        }
      } else {
        return {...s};
      };
    });
    console.log(JSON.stringify(nextItemSetups));
    setItemSetups(nextItemSetups);
  }

  function handleCustomNameChange(value, index) {
    console.log("handleCustomNameChange()");
    const nextItemSetups = itemSetups.map((s, i) => {
      if (i === index) {
        return {
          standardName: s.standardName || "",
          customName: value,
          isCustom: s.isCustom || false,
          cost: s.cost,
        }
      } else {
        return {...s};
      };
    });
    console.log(JSON.stringify(nextItemSetups));
    setItemSetups(nextItemSetups);
  }

  function handleCustomNameCheckboxChange(index) {
    console.log("handleCustomNameCheckboxChange()");
    const nextItemSetups = itemSetups.map((s, i) => {
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
    console.log(JSON.stringify(nextItemSetups));
    setItemSetups(nextItemSetups);
  }

  function handleCostChange(value, index) {
    console.log("handleCostChange()");
    const nextItemSetups = itemSetups.map((s, i) => {
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
    console.log(JSON.stringify(nextItemSetups));
    setItemSetups(nextItemSetups);
  }

  function addItemSetup(index) {
    const nextItemSetups = [
      ...itemSetups.slice(0, index+1),
      {},
      ...itemSetups.slice(index+1),
    ];
    setItemSetups(nextItemSetups);
  }

  function deleteItemSetup(index) {
    if (itemSetups.length === 1) return;
    const nextItemSetups = [
      ...itemSetups.slice(0, index),
      ...itemSetups.slice(index+1),
    ];
    setItemSetups(nextItemSetups);
  }

  function standardSetupSelectFrag(i) {
    const standardSetupsSelectOptions = standardSetups.map(ss => {
      return <option value={ss.name}>{ss.name}</option>;
    });
    return <>
      <select
        value={itemSetups[i].standardName}
        onChange={e => handleStandardNameChange(e.target.value, i)}
        style={{width: "157px"}}
      >
        <option value=""></option>
        {standardSetupsSelectOptions}
      </select>
    </>;
  };

  const itemSetupsRowsFrag = itemSetups.map((is, i) => {
    const setupCustomNameInputFrag = <input
      name="customName"
      value={is.customName}
      onChange={(e) => handleCustomNameChange(e.target.value, i)}
      style={{width: "150px"}}
    />
    return <>
     <tr>
      <td>
        {is.isCustom ? setupCustomNameInputFrag : standardSetupSelectFrag(i)}
        <input
          type="checkbox"
          name="isSetupCustomNameCheckbox"
          checked={is.isCustom}
          onChange={() => handleCustomNameCheckboxChange(i)}
        />

      </td>
      <td><input
        name="cost"
        value={is.cost}
        onChange={(e) => handleCostChange(parseFloat(e.target.value), i)}
      /></td>
      <td><button type="button" onClick={() => deleteItemSetup(i)}> - </button></td>
      <td><button type="button" onClick={() => addItemSetup(i)}> + </button></td>
     </tr>
    </>
  });
  const itemSetupsTotalRowFrag = <tr>
    <td><b>Total</b></td>
    <td><b>{isModel.totalJobCost.toFixed(2)}</b></td>
  </tr>

  return (
   <>
    <h3>Setups:</h3>
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
        {itemSetupsRowsFrag}
        {itemSetupsTotalRowFrag}
      </tbody>
    </table>
   </>
  );
}

export default ItemSetups;
