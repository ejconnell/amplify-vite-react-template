import { useState } from "react";
import { ItemSetupsModel } from "./ItemSetups"
import { ItemInHousesModel } from "./ItemInHouses"

let quoteItemKey = 0;

function blankQuoteItem() {
  return {key: quoteItemKey++};
};

class QuoteItemsModel {
  constructor(items, materials, inHouses, quoteItems) {
    this.rows = quoteItems.map(qi => {
      const item = items.find(_item => _item.name === qi.name);
      if (!item) return {};
      const material = materials.find(m => m.name === item.materialName);
      const materialCostPerUnit = item.gramsPerUnit * material.effectiveCost / 1000;
      const itemSetupsModel = new ItemSetupsModel(item.itemSetups);
      const itemInHousesModel = new ItemInHousesModel(inHouses, item.itemInHouses);
      const setupCostPerUnit = itemSetupsModel.totalJobCost / qi.quantity;

      return {
        material: material,
        materialCostPerUnit: materialCostPerUnit,
        setupCostPerUnit: setupCostPerUnit,
        inHouseCostPerUnit: itemInHousesModel.totalCost,
      };
    });
  }
}

function Quotes({items, materials, inHouses}) {
  const [quoteItems, setQuoteItems] = useState([blankQuoteItem()]);

  const quoteItemsModel = new QuoteItemsModel(items, materials, inHouses, quoteItems);

  function handleQuoteItemNameChange(value, index) {
    console.log(`handleQuoteItemNameChange(${value}, ${index})`);
    const nextQuoteItems = quoteItems.map((qi, i) => {
      if (i === index) {
        return {
          name: value,
          quantity: qi.quantity,
          key: qi.key,
        }
      } else {
        return {...qi};
      };
    });
    console.log(JSON.stringify(nextQuoteItems));
    setQuoteItems(nextQuoteItems);

  }

  function handleQuoteItemQuantityChange(value, index) {
    console.log(`handleQuoteItemQuantityChange(${value}, ${index})`);
    const nextQuoteItems = quoteItems.map((qi, i) => {
      if (i === index) {
        return {
          name: qi.name,
          quantity: value,
          key: qi.key,
        }
      } else {
        return {...qi};
      };
    });
    console.log(JSON.stringify(nextQuoteItems));
    setQuoteItems(nextQuoteItems);
  }

  function addQuoteItem(index) {
    console.log(`addQuoteItem(${index})`);
    const nextQuoteItems = [
      ...quoteItems.slice(0, index+1),
      blankQuoteItem(),
      ...quoteItems.slice(index+1),
    ];
    console.log(JSON.stringify(nextQuoteItems));
    setQuoteItems(nextQuoteItems);
  }

  function deleteQuoteItem(index) {
    if (quoteItems.length === 1) return;
    const nextQuoteItems = [
      ...quoteItems.slice(0, index),
      ...quoteItems.slice(index+1),
    ];
    setQuoteItems(nextQuoteItems);
  }

  const quoteItemsRowsFrag = quoteItems.map((qi, i) => {

    const itemSelectOptions = items.map(item => {
      return <option value={item.name}>{item.name}</option>;
    });

    const quoteItemSelectFrag = <select
      value={qi[i]?.name}
      onChange={e => handleQuoteItemNameChange(e.target.value, i)}
    >
      <option value=""></option>
      {itemSelectOptions}
    </select>

    const quoteItemQuantityFrag = <input
      name="quantity"
      value={qi[i]?.quantity}
      onChange={(e) => {handleQuoteItemQuantityChange(parseFloat(e.target.value), i)}}
    />;

    return <tr key={qi.key}>
      <td>{quoteItemSelectFrag}</td>
      <td>{quoteItemQuantityFrag}</td>
      <td>{quoteItemsModel.rows[i].materialCostPerUnit}</td>
      <td>{quoteItemsModel.rows[i].setupCostPerUnit}</td>
      <td>{quoteItemsModel.rows[i].inHouseCostPerUnit}</td>
      <td><button type="button" onClick={() => deleteQuoteItem(i)}> - </button></td>
      <td><button type="button" onClick={() => addQuoteItem(i)}> + </button></td>
    </tr>
  });

  return (
   <>
    <h1>Quotes page</h1>

    <table border="1px solid black">
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Material Cost</th>
          <th>Setup Cost</th>
          <th>In House Cost</th>
          <th>Delete</th>
          <th>Add</th>
        </tr>
      </thead>
      <tbody>
        {quoteItemsRowsFrag}
      </tbody>
    </table>
   </>
  );
}

export default Quotes;
