import Table from 'react-bootstrap/Table';
import Labels from './Labels'

export class ItemSetupsModel {
  totalCostPerJob: number;
  totalCostPerUnit: number;
  constructor(itemSetups: IItemSetup[], unitQuantity: number) {
    this.totalCostPerJob = itemSetups.map(s => s.costPerJob).reduce((acc, cost) => acc+cost, 0);
    this.totalCostPerUnit = this.totalCostPerJob / unitQuantity;;
  }
}

function ItemSetups({standardSetups, itemSetups, exampleUnitQuantity, setItemSetups}) {
  const isModel = new ItemSetupsModel(itemSetups, exampleUnitQuantity);

  function handleStandardNameChange(value, index) {
    const nextItemSetups = itemSetups.map((s, i) => {
      if (i === index) {
        return {
          key: s.key,
          standardName: value,
          customName: s.customName,
          isCustomName: s.isCustomName,
          costPerJob: s.costPerJob,
        }
      } else {
        return {...s};
      };
    });
    setItemSetups(nextItemSetups);
  }

  function handleCustomNameChange(value, index) {
    const nextItemSetups = itemSetups.map((s, i) => {
      if (i === index) {
        return {
          key: s.key,
          standardName: s.standardName,
          customName: value,
          isCustomName: s.isCustomName,
          costPerJob: s.costPerJob,
        }
      } else {
        return {...s};
      };
    });
    setItemSetups(nextItemSetups);
  }

  function handleCustomNameCheckboxChange(index) {
    const nextItemSetups = itemSetups.map((s, i) => {
      if (i === index) {
        return {
          key: s.key,
          standardName: s.standardName,
          customName: s.customName,
          isCustomName: !s.isCustomName,
          costPerJob: s.costPerJob,
        }
      } else {
        return {...s};
      };
    });
    setItemSetups(nextItemSetups);
  }

  function handleCostChange(value, index) {
    const nextItemSetups = itemSetups.map((s, i) => {
      if (i === index) {
        return {
          key: s.key,
          standardName: s.standardName,
          customName: s.customName,
          isCustomName: s.isCustomName,
          costPerJob: value,
        }
      } else {
        return {...s};
      };
    });
    setItemSetups(nextItemSetups);
  }

  function addItemSetup(index) {
    const nextItemSetups = [
      ...itemSetups.slice(0, index+1),
      {
        key: crypto.randomUUID(),
        standardName: "",
        customName: "",
        isCustomName: false,
        costPerJob: "",
      },
      ...itemSetups.slice(index+1),
    ];
    setItemSetups(nextItemSetups);
  }

  function deleteItemSetup(index) {
    const nextItemSetups = [
      ...itemSetups.slice(0, index),
      ...itemSetups.slice(index+1),
    ];
    setItemSetups(nextItemSetups);
  }

  function standardSetupSelectFrag(i) {
    const standardSetupsSelectOptions = standardSetups.map(ss => {
      return <option value={ss.name} key={ss.name}>{ss.name}</option>;
    });
    return (
      <select
        value={itemSetups[i].standardName}
        onChange={e => handleStandardNameChange(e.target.value, i)}
        style={{width: "157px"}}
      >
        <option value="" key="blank option"></option>
        {standardSetupsSelectOptions}
      </select>
    );
  };

  const itemSetupsRowsFrag = itemSetups.map((is, i) => {
    const setupCustomNameInputFrag = <input
      name="customName"
      value={is.customName}
      onChange={(e) => handleCustomNameChange(e.target.value, i)}
      style={{width: "150px"}}
    />
    const rowCostPerUnit = is.costPerJob / exampleUnitQuantity;
    return <tr key={is.key}>
      <td>
        {is.isCustomName ? setupCustomNameInputFrag : standardSetupSelectFrag(i)}
        <input
          type="checkbox"
          name="isSetupCustomNameCheckbox"
          checked={is.isCustomName}
          onChange={() => handleCustomNameCheckboxChange(i)}
        />
      </td>
      <td><input
        name="costPerJob"
        value={is.costPerJob}
        onChange={(e) => handleCostChange(e.target.value, i)}
      /></td>
      <td>{rowCostPerUnit.toFixed(2)}</td>
      <td><button type="button" onClick={() => deleteItemSetup(i)}> - </button></td>
      <td><button type="button" onClick={() => addItemSetup(i)}> + </button></td>
    </tr>
  });
  const itemSetupsEmptyRowFrag = <tr key="empty row">
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td><button type="button" onClick={() => addItemSetup(-1)}> + </button></td>
  </tr>;
  const itemSetupsTotalRowFrag = <tr key="total row">
    <td><b>Total</b></td>
    <td><b>{isModel.totalCostPerJob.toFixed(2)}</b></td>
    <td><b>{isModel.totalCostPerUnit.toFixed(2)}</b></td>
    <td></td>
    <td></td>
  </tr>

  return (
   <>
    <h4>Setup:</h4>
    <p>{Labels.exampleUnitQuantity.chinese} Example unit quantity: {exampleUnitQuantity || 0} &rarr; {Labels.costPerUnit.chinese} Cost per unit: {isModel.totalCostPerUnit.toFixed(2)}</p>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{Labels.name.chinese} {Labels.checkBoxForCustom.chinese} Name (check box for custom)</th>
          <th>{Labels.costPerJob.chinese} Cost per job</th>
          <th>{Labels.costPerUnit.chinese} Cost per unit</th>
          <th>{Labels.remove.chinese} Delete</th>
          <th>{Labels.add.chinese} Add</th>
        </tr>
      </thead>
      <tbody>
        {itemSetups.length === 0 ? itemSetupsEmptyRowFrag : itemSetupsRowsFrag}
        {itemSetupsTotalRowFrag}
      </tbody>
    </Table>
   </>
  );
}

export default ItemSetups;
