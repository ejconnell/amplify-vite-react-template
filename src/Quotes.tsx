import { useState } from "react";

let quoteItemKey = 0;

function blankQuoteItem() {
  return {key: quoteItemKey++};
};

function Quotes({items}) {
  const [quoteItems, setQuoteItems] = useState([blankQuoteItem()]);

  const quoteItemsDerived = quoteItems.map(qi => {
    return {
    };
  });
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
