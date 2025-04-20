import { useState } from "react";

export class ItemInHousesModel {
  constructor(inHouses, itemInHouses) {
    this.rows = itemInHouses.map(iih => {
      const costPer1k = inHouses.find(ih => ih.name === iih.name)?.cost;
      const costPerUnit = costPer1k * iih?.quantity / 1000;
      return {
        costPer1k: costPer1k,
        costPerUnit: costPerUnit,
      }
    });

    this.totalCostPerUnit = this.rows.map(row => row.costPerUnit).reduce((acc, cost) => acc+cost, 0);
  }
}

function ItemInHouses({inHouses, itemInHouses, setItemInHouses}) {
  const iihModel = new ItemInHousesModel(inHouses, itemInHouses);

  console.log(`ItemInHouses() ${JSON.stringify(itemInHouses)}`);

  function handleItemInHouseNameChange(value, index) {
    console.log("handleItemInHouseNameChange()");
    const nextItemInHouses = itemInHouses.map((iih, i) => {
      if (i === index) {
        return {
          key: iih.key,
          name: value,
          quantity: iih.quantity,
        }
      } else {
        return {...iih};
      };
    });
    console.log(JSON.stringify(nextItemInHouses));
    setItemInHouses(nextItemInHouses);
  }

  function handleItemInHouseQuantityChange(value, index) {
    console.log("handleItemInHouseQuantityChange()");
    const nextItemInHouses = itemInHouses.map((iih, i) => {
      if (i === index) {
        return {
          key: iih.key,
          name: iih.name,
          quantity: value,
        }
      } else {
        return {...iih};
      };
    });
    console.log(JSON.stringify(nextItemInHouses));
    setItemInHouses(nextItemInHouses);
  }

  function addItemInHouse(index) {
    const nextItemInHouses = [
      ...itemInHouses.slice(0, index+1),
      {
        key: crypto.randomUUID(),
        quantity: 0,
      },
      ...itemInHouses.slice(index+1),
    ];
    setItemInHouses(nextItemInHouses);
  }

  function deleteItemInHouse(index) {
    const nextItemInHouses = [
      ...itemInHouses.slice(0, index),
      ...itemInHouses.slice(index+1),
    ];
    setItemInHouses(nextItemInHouses);
  }

  function itemInHouseSelectFrag(i) {
    const inHousesSelectOptions = inHouses.map(ih => {
      return <option value={ih.name} key={ih.name}>{ih.name}</option>;
    });
    return <>
      <select
        value={itemInHouses[i].name}
        onChange={e => handleItemInHouseNameChange(e.target.value, i)}
        style={{width: "157px"}}
      >
        <option value=""></option>
        {inHousesSelectOptions}
      </select>
    </>;
  };

  const itemInHousesRowsFrag = itemInHouses.map((iih, i) => {
    return <tr key={iih.key}>
      <td>
        {itemInHouseSelectFrag(i)}
      </td>
      <td><input
        name="quantity"
        value={iih.quantity}
        onChange={(e) => handleItemInHouseQuantityChange(parseFloat(e.target.value), i)}
      /></td>
      <td>{iihModel.rows[i].costPer1k}</td>
      <td>{iihModel.rows[i].costPerUnit.toFixed(2)}</td>
      <td><button type="button" onClick={() => deleteItemInHouse(i)}> - </button></td>
      <td><button type="button" onClick={() => addItemInHouse(i)}> + </button></td>
    </tr>
  });
  const itemInHousesEmptyRowFrag = <tr key="empty row">
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td><button type="button" onClick={() => addItemInHouse(-1)}> + </button></td>
  </tr>;
  const itemInHousesTotalRowFrag = <tr key="total row">
    <td><b>Total</b></td>
    <td></td>
    <td></td>
    <td><b>{iihModel.totalCostPerUnit.toFixed(2)}</b></td>
  </tr>;

  return (
   <>
    <h3>In House:</h3>
    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Cost Per 1k</th>
          <th>Cost Per Unit</th>
          <th>Delete</th>
          <th>Add</th>
        </tr>
      </thead>
      <tbody>
        {itemInHouses.length === 0 ? itemInHousesEmptyRowFrag : itemInHousesRowsFrag}
        {itemInHousesTotalRowFrag}
      </tbody>
    </table>
   </>
  );
}

export default ItemInHouses;
