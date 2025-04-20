import { useState } from "react";

export class ItemWastageModel {
  constructor(itemWastage) {
    this.totalCostPerJob = itemWastage.map(s => Number(s.costPerJob)).reduce((acc, cost) => acc+cost, 0);
  }
}

export function ItemWastageStartingRange() {
  return {
    key: crypto.randomUUID(),
    starting: 0,
    ending: Infinity,
    wastagePercent: 0,
  };
}

function ItemWastage({itemWastage, exampleQuantity, setItemWastage}) {
  const [splitRangeAt, setSplitRangeAt] = useState("");

  const iwModel = new ItemWastageModel(itemWastage);


  function handleWastagePercentChange(value, index) {
    console.log("handleWastagePercentChange()");
    const nextItemWastage = itemWastage.map((iw, i) => {
      if (i === index) {
        return {
          key: iw.key,
          starting: iw.starting,
          ending: iw.ending,
          wastagePercent: value,
        }
      } else {
        return {...iw};
      };
    });
    console.log(JSON.stringify(nextItemWastage));
    setItemWastage(nextItemWastage);
  }

  function handleSplitRange() {
    const startingNumber = Number(splitRangeAt);
    if (!Number.isInteger(startingNumber)) {
      alert("'Spllit range at' value must be integer");
      return;
    }
    const nextItemWastage = [];
    for (const entry of itemWastage) {
      if ((startingNumber > entry.starting) && (startingNumber < entry.ending)) {
        nextItemWastage.push({
          key: crypto.randomUUID(),
          starting: startingNumber,
          ending: entry.ending,
          wastagePercent: entry.wastagePercent,
        });
        nextItemWastage.push({
          key: entry.key,
          starting: entry.starting,
          ending: startingNumber - 1,
          wastagePercent: entry.wastagePercent,
        });
      } else {
        nextItemWastage.push(entry);
      }
    }
    setItemWastage(nextItemWastage);
  };

  function handleMergeRanges(index, isKeepUpper) {
    const nextItemWastage = [];
    itemWastage.forEach((entry, i) => {
      if (index === i) {
        nextItemWastage.push({
          key: entry.key,
          starting: itemWastage[i+1].starting,
          ending: entry.ending,
          wastagePercent: isKeepUpper ? entry.wastagePercent : itemWastage[i+1].wastagePercent,
        });
      } else if (index+1 === i) {
        true;
      } else {
        nextItemWastage.push(entry);
      }
    });
    setItemWastage(nextItemWastage);
  };

  function standardSetupSelectFrag(i) {
    const standardWastageSelectOptions = standardWastage.map(ss => {
      return <option value={ss.name} key={ss.name}>{ss.name}</option>;
    });
    return <>
      <select
        value={itemWastage[i].standardName}
        onChange={e => handleStandardNameChange(e.target.value, i)}
        style={{width: "157px"}}
      >
        <option value=""></option>
        {standardWastageSelectOptions}
      </select>
    </>;
  };

  const itemWastageRowsFrag = itemWastage.map((iw, i) => {
    return <tr key={iw.key}>
      <td>{iw.starting}</td>
      <td>{iw.ending}</td>
      <td><input
        name="wastagePercent"
        value={iw.wastagePercent}
        onChange={(e) => handleWastagePercentChange(e.target.value, i)}
      /></td>
    </tr>
  });

  return (
   <>
    <h3>Wastage:</h3>
    <table border="1px solid black">
      <thead>
        <tr>
          <th>Range Start</th>
          <th>Range End</th>
          <th>Wastage Percent</th>
        </tr>
      </thead>
      <tbody>
        {itemWastageRowsFrag}
      </tbody>
    </table>

    <input
      value={splitRangeAt}
      onChange={e => setSplitRangeAt(e.target.value)}
    />
    <button type="button" onClick={handleSplitRange}>Split Range At</button>
    <br/>
    <button type="button" onClick={e => handleMergeRanges(1, true)}>Merge Range (keep upper)</button>
    <button type="button" onClick={e => handleMergeRanges(1, false)}>Merge Range (keep lower)</button>
   </>
  );
}

export default ItemWastage;
