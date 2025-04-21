import { useState } from "react";

class OutsourcingModel {
  constructor({isPricedByUnit, variableCost, minCost}) {
    //this.isPricedByUnit = isPricedByUnit;
    //this.variableCost = variableCost;
    //this.minCost = minCost;
    this.pricingCutover = minCost / variableCost;
  }
}

function Outsourcings({outsourcings, saveOutsourcing}) {
  const [name, setName] = useState("");
  const [isPricedByUnit, setIsPricedByUnit] = useState(false);
  const [variableCost, setVariableCost] = useState(0);
  const [minCost, setMinCost] = useState(0);

  const variableCostLabel = isPricedByUnit ? "unit" : "kilogram";

  const outsourcingModel = new OutsourcingModel({
    isPricedByUnit: isPricedByUnit,
    variableCost: variableCost,
    minCost: minCost,
  });

  function handleSaveOutsourcing() {
    if (!name) {
      alert("Need a Name");
      return;
    }
    if (!variableCost || isNaN(variableCost)) {
      alert(`Need a numeric cost per ${variableCostLabel}`);
      return;
    }
    if (isNaN(minCost)) {
      alert("Need a numeric minimum cost");
      return;
    }
    const outsourcing = {
      name: name,
      isPricedByUnit: isPricedByUnit,
      variableCost: Number(variableCost),
      minCost: Number(minCost),
    };
    saveOutsourcing(outsourcing);
  };

  function handleLoadOutsourcing(index) {
     const os = outsourcings[index];
     setName(os.name);
     setIsPricedByUnit(os.isPricedByUnit);
     setVariableCost(os.variableCost);
     setMinCost(os.minCost);
  }

  const outsourcingsRowsFrag = outsourcings.map((os, i) => {
    const osModel = new OutsourcingModel(os);
    const formattedCutover = isNaN(osModel.pricingCutover) ? "-" : osModel.pricingCutover.toFixed(4);
    return <tr key={os.name}>
      <td>{os.name}</td>
      <td>{os.isPricedByUnit ? "Unit" : "Kilogram"}</td>
      <td>{os.minCost}</td>
      <td>{os.isPricedByUnit ? "-" : os.variableCost}</td>
      <td>{os.isPricedByUnit ? "-" : formattedCutover }</td>
      <td>{os.isPricedByUnit ? os.variableCost : "-"}</td>
      <td>{os.isPricedByUnit ? formattedCutover || "-": "-"}</td>
      <td>
        <button type="button" onClick={() => handleLoadOutsourcing(i)}>View/Edit</button>
      </td>
    </tr>
  });

  return (
   <>
    <h1>Outsourcings page</h1>
    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
          <th>Priced by</th>
          <th>Minimum cost</th>
          <th>Cost per kilogram</th>
          <th>Pricing cutover kilograms</th>
          <th>Cost per unit</th>
          <th>Pricing cutover units</th>
          <th>View/Edit</th>
        </tr>
      </thead>
      <tbody>
        {outsourcingsRowsFrag}
      </tbody>
    </table>

    <label>Name:</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <br/>

    <label>Minimum Cost:</label>
    <input
      value={minCost}
      onChange={(e) => setMinCost(e.target.value)}
    />
    <br/>

    <label>Priced by unit:</label>
    <input
      type="checkbox"
      name="isPricedByUnit"
      checked={isPricedByUnit}
      onChange={(e) => setIsPricedByUnit(!isPricedByUnit) }
    />

    <label>Cost per {variableCostLabel}:</label>
    <input
      value={variableCost}
      onChange={(e) => setVariableCost(e.target.value)}
    />

    <label>Pricing cutover {variableCostLabel}s: {outsourcingModel.pricingCutover.toFixed(4)} </label>
    <br/>

    <button type="submit" onClick={handleSaveOutsourcing}>
      Save Outsourcing
    </button>
   </>
  );
}

export default Outsourcings;
