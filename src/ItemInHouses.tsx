import { useState } from "react";

function ItemInHouses({inHouses, itemInHouses, setItemInHouses}) {
  const iihDerived = itemInHouses.map(iih => {
    const costPer1k = inHouses.find(ih => ih.name === iih.name)?.cost;
    const cost = costPer1k * iih?.quantity / 1000;
    return {
      costPer1k: costPer1k,
      cost: cost,
    }
  });

  const itemInHousesSum = iihDerived.map(iih => iih.cost).reduce((acc, cost) => acc+cost, 0);

  function handleItemInHouseNameChange(value, index) {
    console.log("handleItemInHouseNameChange()");
    const nextItemInHouses = itemInHouses.map((iih, i) => {
      if (i === index) {
        return {
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
      {},
      ...itemInHouses.slice(index+1),
    ];
    setItemInHouses(nextItemInHouses);
  }

  function deleteItemInHouse(index) {
    if (itemInHouses.length === 1) return;
    const nextItemInHouses = [
      ...itemInHouses.slice(0, index),
      ...itemInHouses.slice(index+1),
    ];
    setItemInHouses(nextItemInHouses);
  }

  function itemInHouseSelectFrag(i) {
    const inHousesSelectOptions = inHouses.map(ih => {
      return <option value={ih.name}>{ih.name}</option>;
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
    return <>
     <tr>
      <td>
        {itemInHouseSelectFrag(i)}
      </td>
      <td><input
        name="quantity"
        value={iih.quantity}
        onChange={(e) => handleItemInHouseQuantityChange(parseFloat(e.target.value), i)}
      /></td>
      <td>{iihDerived[i].costPer1k}</td>
      <td>{iihDerived[i].cost}</td>
      <td><button type="button" onClick={() => deleteItemInHouse(i)}> - </button></td>
      <td><button type="button" onClick={() => addItemInHouse(i)}> + </button></td>
     </tr>
    </>
  });
  const itemInHousesTotalRowFrag = <tr>
    <td><b>Total</b></td>
    <td></td>
    <td></td>
    <td><b>{itemInHousesSum.toFixed(2)}</b></td>
  </tr>

  return (
   <>
    <h3>In House:</h3>
    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Cost Per 1k</th>
          <th>Cost</th>
          <th>Delete</th>
          <th>Add</th>
        </tr>
      </thead>
      <tbody>
        {itemInHousesRowsFrag}
        {itemInHousesTotalRowFrag}
      </tbody>
    </table>
   </>
  );
}

export default ItemInHouses;
