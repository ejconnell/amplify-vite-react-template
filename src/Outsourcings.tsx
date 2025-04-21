import { useState } from "react";

export class OutsourcingModel {
  constructor({isPricedByUnit, variableCost, minCostPerJob, gramsPerUnit, numUnits}) {
    //this.isPricedByUnit = isPricedByUnit;
    //this.variableCost = variableCost;
    //this.minCostPerJob = minCostPerJob;
    
    if (isPricedByUnit) {
      this.minCostPerUnit = variableCost
      this.costCutoverUnits = minCostPerJob / this.minCostPerUnit;
    } else {
      this.minCostPerKilogram = variableCost;
      this.minCostPerUnit = this.minCostPerKilogram / 1000 * gramsPerUnit
      this.costCutoverUnits = minCostPerJob / this.minCostPerUnit;
    }
    if (numUnits > this.costCutoverUnits) {
      this.costPerUnit = this.minCostPerUnit;
      this.costPerJob = this.costPerUnit * numUnits;
    } else {
      this.costPerJob = minCostPerJob;
      this.costPerUnit = minCostPerJob / numUnits;
    }
  }
}

function Outsourcings({outsourcings, saveOutsourcing}) {
  const [name, setName] = useState("");
  const [isPricedByUnit, setIsPricedByUnit] = useState(false);
  const [variableCost, setVariableCost] = useState(0);
  const [minCostPerJob, setMinCostPerJob] = useState(0);
  const [exampleGramsPerUnit, setExampleGramsPerUnit] = useState(0);
  const [exampleNumUnits, setExampleNumUnits] = useState(0);

  const variableCostLabel = isPricedByUnit ? "unit" : "kilogram";

  const outsourcingModel = new OutsourcingModel({
    isPricedByUnit: isPricedByUnit,
    variableCost: variableCost,
    minCostPerJob: minCostPerJob,
    gramsPerUnit: exampleGramsPerUnit,
    numUnits: exampleNumUnits,
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
    if (isNaN(minCostPerJob)) {
      alert("Need a numeric minimum cost");
      return;
    }
    const outsourcing = {
      name: name,
      isPricedByUnit: isPricedByUnit,
      variableCost: Number(variableCost),
      minCostPerJob: Number(minCostPerJob),
    };
    saveOutsourcing(outsourcing);
  };

  function handleLoadOutsourcing(index) {
     const os = outsourcings[index];
     setName(os.name);
     setIsPricedByUnit(os.isPricedByUnit);
     setVariableCost(os.variableCost);
     setMinCostPerJob(os.minCostPerJob);
  }

  const outsourcingsRowsFrag = outsourcings.map((os, i) => {
    const osModel = new OutsourcingModel({
       ...os,
       gramsPerUnit: exampleGramsPerUnit,
       numUnits: exampleNumUnits,
    });
    //const formattedCutover = isNaN(osModel.pricingCutover) ? "-" : osModel.pricingCutover.toFixed(4);
    return <tr key={os.name}>
      <td>{os.name}</td>
      <td>{os.minCostPerJob}</td>
      <td>{os.isPricedByUnit ? "Unit" : "Kilogram"}</td>
      <td>{os.variableCost}</td>
      <td>{osModel.minCostPerKilogram}</td>
      <td>{osModel.minCostPerUnit.toFixed(4)}</td>
      <td>{osModel.costCutoverUnits.toFixed(1)}</td>
      <td>{osModel.costPerUnit.toFixed(4)}</td>
      <td>{osModel.costPerJob.toFixed(0)}</td>
      <td>
        <button type="button" onClick={() => handleLoadOutsourcing(i)}>Load</button>
      </td>
    </tr>
  });

  return (
   <>
    <h1>Outsourcings page</h1>

    <label>Example grams per unit:</label>
    <input
      value={exampleGramsPerUnit}
      onChange={(e) => setExampleGramsPerUnit(e.target.value)}
    />

    <label>Example num units:</label>
    <input
      value={exampleNumUnits}
      onChange={(e) => setExampleNumUnits(e.target.value)}
    />

    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
          <th>Minimum cost per job</th>
          <th>Priced by</th>
          <th>Variable cost</th>
          <th>Minimum Cost per kilogram</th>
          <th>Minimum Cost per unit</th>
          <th>Cost cutover units</th>
          <th>Cost per unit</th>
          <th>Cost per job</th>
          <th>Load</th>
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

    <label>Minimum Cost per job:</label>
    <input
      value={minCostPerJob}
      onChange={(e) => setMinCostPerJob(e.target.value)}
    />
    <br/>

    <label>Priced by unit:</label>
    <input
      type="checkbox"
      name="isPricedByUnit"
      checked={isPricedByUnit}
      onChange={(e) => setIsPricedByUnit(!isPricedByUnit) }
    />

    <label>Minimum cost per {variableCostLabel}:</label>
    <input
      value={variableCost}
      onChange={(e) => setVariableCost(e.target.value)}
    />

    <br/>
    <label>Minimum cost per kilogram: {outsourcingModel.minCostPerKilogram?.toFixed(0)} </label>
    <br/>
    <label>Minimum cost per unit: {outsourcingModel.minCostPerUnit.toFixed(4)} </label>
    <br/>
    <label>Cost cutover units: {outsourcingModel.costCutoverUnits.toFixed(1)} </label>
    <br/>
    <label>Cost per unit: {outsourcingModel.costPerUnit.toFixed(4)} </label>
    <br/>
    <label>Cost per job: {outsourcingModel.costPerJob.toFixed(0)} </label>
    <br/>

    <button type="submit" onClick={handleSaveOutsourcing}>
      Save Outsourcing
    </button>
   </>
  );
}

export default Outsourcings;
