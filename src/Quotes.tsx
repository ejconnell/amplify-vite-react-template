import { useState } from "react";
import Table from 'react-bootstrap/Table';
import { ItemModel } from "./ItemModel";
import Trifold from "./Trifold";
import L10n from "./L10n";
import { TabLabels } from "./TabLabels";
import { IInHouse, IItem, IMaterial, IMetal, IOutsourcing, IQuote, IQuoteItem, IQuoteItemModelResult } from "./Types";
import { blankItem } from "./Items";

function blankQuoteItem() {
  return {
    key: crypto.randomUUID(),
    name: "",
    quantity: "",
  };
};

class QuoteItemModel {
  materialCostPerUnit: number;
  inHouseCostPerUnit: any;
  outsourcingCostPerUnit: any;
  baseCostPerUnit: any;
  wastagePercent: number;
  postWastageCostPerUnit: number;
  postLaborCostPerUnit: number;
  setupCostPerUnit: number;
  postSetupCostPerUnit: number;
  postTaxCostPerUnit: number;
  overheadPercent: number;
  postOverheadCostPerUnit: number;
  postProfitCostPerUnit: number;
  constructor({items, materials, metals, inHouses, outsourcings, quoteItem}: {items: IItem[], materials: IMaterial[], metals: IMetal[], inHouses: IInHouse[], outsourcings: IOutsourcing[], quoteItem: IQuoteItem}) {
    const item = items.find(i => i.name === quoteItem.name) || blankItem();

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
    this.baseCostPerUnit = this.materialCostPerUnit + this.inHouseCostPerUnit + this.outsourcingCostPerUnit;
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

  results() {
    return {
      materialCostPerUnit: this.materialCostPerUnit,
      inHouseCostPerUnit: this.inHouseCostPerUnit,
      outsourcingCostPerUnit: this.outsourcingCostPerUnit,
      baseCostPerUnit: this.baseCostPerUnit,
      wastagePercent: this.wastagePercent,
      postWastageCostPerUnit: this.postWastageCostPerUnit,
      postLaborCostPerUnit: this.postLaborCostPerUnit,
      setupCostPerUnit: this.setupCostPerUnit,
      postSetupCostPerUnit: this.postSetupCostPerUnit,
      postTaxCostPerUnit: this.postTaxCostPerUnit,
      overheadPercent: this.overheadPercent,
      postOverheadCostPerUnit: this.postOverheadCostPerUnit,
      postProfitCostPerUnit: this.postProfitCostPerUnit,
    };
  }
}

function Quotes({quotes, items, materials, metals, inHouses, outsourcings, saveQuote}: {quotes: IQuote[], items: IItem[], materials: IMaterial[], metals: IMetal[], inHouses: IInHouse[], outsourcings: IOutsourcing[], saveQuote: (quote: IQuote) => void}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quoteItems, setQuoteItems] = useState<IQuoteItem[]>([blankQuoteItem()]);
  const [fixedName, setFixedName] = useState("");
  const [fixedTimestamp, setFixedTimestamp] = useState<number>(0);
  const [fixedDescription, setFixedDescription] = useState("");
  const [fixedQuoteItems, setFixedQuoteItems] = useState<IQuoteItem[]>([]);
  const [quoteItemsModelResults, setQuoteItemsModelResults] = useState<IQuoteItemModelResult[]>([]);

  const quoteItemsModels = quoteItems.map(qi => {
    return new QuoteItemModel({
       items: items,
       materials: materials,
       metals: metals,
       inHouses: inHouses,
       outsourcings: outsourcings,
       quoteItem: qi,
    });
  });

  function handleSaveQuote() {
    if (!name) {
      alert("Need a name");
      return;
    }
    quoteItems.forEach((qi, i) => {
      if (!qi.name) {
        alert(`Quote row ${i+1} needs a name`);
        return;
      }
      if (!qi.quantity || isNaN(Number(qi.quantity))) {
        alert(`Quote row ${i+1} needs a numeric quantity`);
        return;
      }
    });
    const quote = {
      name: name,
      timestamp: Date.now(),
      description: description,
      quoteItems: quoteItems,
      quoteItemsModelResults: quoteItemsModels.map(qim => qim.results()),
    };
    saveQuote(quote);
  }

  function handleLoadQuote(i: number) {
    const quote = quotes[i];
    setName(quote.name);
    setDescription(quote.description);
    setQuoteItems(quote.quoteItems);
    setFixedName(quote.name);
    setFixedTimestamp(quote.timestamp);
    setFixedDescription(quote.description);
    setFixedQuoteItems(quote.quoteItems);
    setQuoteItemsModelResults(quote.quoteItemsModelResults);
  }

  function handleQuoteItemNameChange(value: string, index: number) {
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

  function handleQuoteItemQuantityChange(value: string, index: number) {
    console.log(`handleQuoteItemQuantityChange(${value}, ${index})`);
    const nextQuoteItems: IQuoteItem[] = quoteItems.map((qi, i) => {
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
    console.log(`handleQuoteItemQuantityChange setting to ${JSON.stringify(nextQuoteItems)}`);
    setQuoteItems(nextQuoteItems);
  }

  function addQuoteItem(index: number) {
    console.log(`addQuoteItem(${index})`);
    const nextQuoteItems: IQuoteItem[] = [
      ...quoteItems.slice(0, index+1),
      blankQuoteItem(),
      ...quoteItems.slice(index+1),
    ];
    console.log(JSON.stringify(nextQuoteItems));
    setQuoteItems(nextQuoteItems);
  }

  function deleteQuoteItem(index: number) {
    if (quoteItems.length === 1) return;
    const nextQuoteItems = [
      ...quoteItems.slice(0, index),
      ...quoteItems.slice(index+1),
    ];
    setQuoteItems(nextQuoteItems);
  }

  function formatQuoteItemModelResultsCells(qimr: IQuoteItemModelResult) {
    return <>
      <td>{qimr.materialCostPerUnit.toFixed(2)}</td>
      <td>{qimr.inHouseCostPerUnit.toFixed(2)}</td>
      <td>{qimr.outsourcingCostPerUnit.toFixed(2)}</td>
      <td>{qimr.baseCostPerUnit.toFixed(2)}</td>
      <td>{qimr.wastagePercent.toFixed(2)}%</td>
      <td>{qimr.postWastageCostPerUnit.toFixed(2)}</td>
      <td>{qimr.postLaborCostPerUnit.toFixed(2)}</td>
      <td>{qimr.setupCostPerUnit.toFixed(2)}</td>
      <td>{qimr.postSetupCostPerUnit.toFixed(2)}</td>
      <td>{qimr.postTaxCostPerUnit.toFixed(2)}</td>
      <td>{qimr.overheadPercent.toFixed(2)}%</td>
      <td>{qimr.postOverheadCostPerUnit.toFixed(2)}</td>
      <td>{qimr.postProfitCostPerUnit.toFixed(2)}</td>
    </>;
  }

  const loadedQuoteItemRowsFrag = quoteItemsModelResults.map((qimr, i) => {
    const qi = fixedQuoteItems[i];
    return <tr key={qi.key}>
      <td>{qi.name}</td>
      <td>{qi.quantity}</td>
      {formatQuoteItemModelResultsCells(qimr)}
    </tr>;
  });

  const columnHeadersFrag = (<>
    <th>{L10n.item.chinese} Item</th>
    <th>{L10n.quantity.chinese} Quantity</th>
    <th>{L10n.material.chinese} {L10n.cost.chinese} Material Cost</th>
    <th>{L10n.inHouse.chinese} {L10n.cost.chinese} In House Cost</th>
    <th>{L10n.outsourcing.chinese} {L10n.cost.chinese} Oustsourcing cost</th>
    <th>{L10n.baseUnit.chinese} Base unit cost</th>
    <th>{L10n.wastage.chinese} Wastage percent</th>
    <th>{L10n.wastageIncluded.chinese} Wastage included</th>
    <th>{L10n.laborIncluded.chinese} Labor included 3%</th>
    <th>{L10n.setupCost.chinese} Setup Cost</th>
    <th>{L10n.setupIncluded.chinese} Setup included</th>
    <th>{L10n.taxIncluded.chinese} Tax included</th>
    <th>{L10n.overhead.chinese} Overhead percent</th>
    <th>{L10n.overheadIncluded.chinese} Overhead included</th>
    <th>{L10n.profitIncluded.chinese} Profit included 6%</th>
  </>);

  const loadedQuoteSectionFrag = <>
    <label>{L10n.name.chinese} Name: {fixedName}</label>
    <br/>
    <label>{L10n.description.chinese} Description: {fixedDescription}</label>
    <br/>
    <label>{L10n.createdAt.chinese} Created at: {(new Date(fixedTimestamp)).toLocaleString()}</label>
    <Table bordered striped>
      <thead>
        <tr>
          {columnHeadersFrag}
        </tr>
      </thead>
      <tbody>
        {loadedQuoteItemRowsFrag}
      </tbody>
    </Table>
    <br/>
    <br/>
  </>;

  const MAX_SUMMARY_LENGTH = 80;
  const quoteRowsFrag = quotes.map((q, i) => {
    let summary = q.quoteItems.map(qi => {
      return `${qi.name}: ${qi.quantity}`;
    }).join(", ");
    if (summary.length > MAX_SUMMARY_LENGTH) {
      summary = summary.slice(0, MAX_SUMMARY_LENGTH - 3) + "...";
    }
    return (
      <tr key={q.name + q.timestamp}>
        <td>{q.name}</td>
        <td>{(new Date(q.timestamp)).toLocaleString()}</td>
        <td>{q.description}</td>
        <td>{summary}</td>
        <td><button type="button" onClick={() => handleLoadQuote(i)}>Load</button></td>
      </tr>
    );
  });

  const quoteItemsRowsFrag = quoteItems.map((qi, i) => {

    const qimr = quoteItemsModels[i].results();

    const itemSelectOptions = items.map(item => {
      return <option value={item.name} key={item.name}>{item.name}</option>;
    });

    const quoteItemSelectFrag = <select
      value={qi.name}
      onChange={e => handleQuoteItemNameChange(e.target.value, i)}
    >
      <option value="" key="blank item"></option>
      {itemSelectOptions}
    </select>

    const quoteItemQuantityFrag = <input
      name="quantity"
      value={qi.quantity}
      onChange={(e) => {handleQuoteItemQuantityChange(e.target.value, i)}}
      style={{width: "60px"}}
    />;

    return <tr key={qi.key}>
      <td>{quoteItemSelectFrag}</td>
      <td>{quoteItemQuantityFrag}</td>
      {formatQuoteItemModelResultsCells(qimr)}
      <td><button type="button" onClick={() => deleteQuoteItem(i)}> - </button></td>
      <td><button type="button" onClick={() => addQuoteItem(i)}> + </button></td>
    </tr>
  });

  const allQuotesFrag = (<>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{L10n.material.chinese} Name</th>
          <th>{L10n.timestamp.chinese} Timestamp</th>
          <th>{L10n.description.chinese} Description</th>
          <th>{L10n.summary.chinese} Summary</th>
          <th>{L10n.load.chinese} Load</th>
        </tr>
      </thead>
      <tbody>
        {quoteRowsFrag}
      </tbody>
    </Table>
  </>);

  const currentQuoteFrag = (<>
    {fixedName && loadedQuoteSectionFrag }

    <label>{L10n.name.chinese} Name:</label>
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />

    <label>{L10n.description.chinese} Description:</label>
    <input
      value={description}
      onChange={e => setDescription(e.target.value)}
      style={{width: "400px"}}
    />

    <Table bordered striped>
      <thead>
        <tr>
          {columnHeadersFrag}
          <th>{L10n.remove.chinese} Delete</th>
          <th>{L10n.add.chinese} Add</th>
        </tr>
      </thead>
      <tbody>
        {quoteItemsRowsFrag}
      </tbody>
    </Table>

    <button type="submit" onClick={handleSaveQuote}>
      {L10n.save.chinese} {L10n.quote.chinese} Save New Quote
    </button>
  </>);

  const administrationFrag = <></>;

  return (
    <Trifold
      top={allQuotesFrag}
      middle={currentQuoteFrag}
      bottom={administrationFrag}
      label={TabLabels.quote}
    />
  );
}

export default Quotes;
