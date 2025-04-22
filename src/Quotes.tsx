import { useState } from "react";
import { ItemSetupsModel } from "./ItemSetups"
import { ItemInHousesModel } from "./ItemInHouses"
import { ItemModel } from "./Items"

function blankQuoteItem() {
  return {key: crypto.randomUUID()};
};

class QuoteItemModel {
  constructor({items, materials, metals, inHouses, outsourcings, quoteItem}) {
    const item = items.find(i => i.name === quoteItem.name) || {};

    const im = new ItemModel({
      materials: materials,
      metals: metals,
      inHouses: inHouses,
      outsourcings: outsourcings,
      ...item,
      unitQuantity: Number(quoteItem.quantity),
    });

    this.materialCostPerUnit = im.materialCostPerUnit
    this.inHouseCostPerUnit = im.inHouseCostPerUnit
    this.outsourcingCostPerUnit = im.outsourcingCostPerUnit
    this.baseCostPerUnit = this.materialCostPerUnit + this.inHouseCostPerUnit + this.inHouseCostPerUnit
    this.wastagePercent = im.wastagePercent
    this.postWastageCostPerUnit = this.baseCostPerUnit * (1 + (this.wastagePercent / 100));
    this.postLaborCostPerUnit = this.postWastageCostPerUnit * 1.03;
    this.setupCostPerUnit = im.setupCostPerUnit;
    this.postSetupCostPerUnit = this.postLaborCostPerUnit + this.setupCostPerUnit;
    this.postTaxCostPerUnit = this.postSetupCostPerUnit * 1.03;
    this.overheadPercent = im.overheadPercent;
    this.postOverheadCostPerUnit = this.postTaxCostPerUnit * (1 + (this.overheadPercent / 100));
    this.postProfitCostPerUnit = this.postOverheadCostPerUnit * 1.06;
  }
}

function Quotes({items, materials, metals, inHouses, outsourcings}) {
  const [quoteItems, setQuoteItems] = useState([blankQuoteItem()]);

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

    const quoteItemModel = new QuoteItemModel({
       items: items,
       materials: materials,
       metals: metals,
       inHouses: inHouses,
       outsourcings: outsourcings,
       quoteItem: qi,
    });

    const itemSelectOptions = items.map(item => {
      return <option value={item.name} key={item.name}>{item.name}</option>;
    });

    const quoteItemSelectFrag = <select
      value={qi[i]?.name}
      onChange={e => handleQuoteItemNameChange(e.target.value, i)}
    >
      <option value="" key="blank item"></option>
      {itemSelectOptions}
    </select>

    const quoteItemQuantityFrag = <input
      name="quantity"
      value={qi[i]?.quantity}
      onChange={(e) => {handleQuoteItemQuantityChange(parseFloat(e.target.value), i)}}
      style={{width: "60px"}}
    />;

    return <tr key={qi.key}>
      <td>{quoteItemSelectFrag}</td>
      <td>{quoteItemQuantityFrag}</td>
      <td>{quoteItemModel.materialCostPerUnit.toFixed(2)}</td>
      <td>{quoteItemModel.inHouseCostPerUnit.toFixed(2)}</td>
      <td>{quoteItemModel.outsourcingCostPerUnit.toFixed(2)}</td>
      <td>{quoteItemModel.baseCostPerUnit.toFixed(2)}</td>
      <td>{quoteItemModel.wastagePercent.toFixed(2)}%</td>
      <td>{quoteItemModel.postWastageCostPerUnit.toFixed(2)}</td>
      <td>{quoteItemModel.postLaborCostPerUnit.toFixed(2)}</td>
      <td>{quoteItemModel.setupCostPerUnit.toFixed(2)}</td>
      <td>{quoteItemModel.postSetupCostPerUnit.toFixed(2)}</td>
      <td>{quoteItemModel.postTaxCostPerUnit.toFixed(2)}</td>
      <td>{quoteItemModel.overheadPercent.toFixed(2)}%</td>
      <td>{quoteItemModel.postOverheadCostPerUnit.toFixed(2)}</td>
      <td>{quoteItemModel.postProfitCostPerUnit.toFixed(2)}</td>
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
          <th>In House Cost</th>
          <th>Oustsourcing cost</th>
          <th>Base unit cost</th>
          <th>Wastage percent</th>
          <th>Wastage included</th>
          <th>Labor included 3%</th>
          <th>Setup Cost</th>
          <th>Setup included</th>
          <th>Tax included</th>
          <th>Overhead percent</th>
          <th>Overhead included</th>
          <th>Profit included 6%</th>
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
