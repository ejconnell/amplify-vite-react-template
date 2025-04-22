import { useState } from "react";

function Outsourcings({outsourcings, saveOutsourcing}) {
  const [name, setName] = useState("");
  const [isPricedByUnit, setIsPricedByUnit] = useState(false);
  const [variableCost, setVariableCost] = useState(0);
  const [minCostPerJob, setMinCostPerJob] = useState(0);

  const variableCostLabel = isPricedByUnit ? "unit" : "kilogram";

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
    return <tr key={os.name}>
      <td>{os.name}</td>
      <td>{os.minCostPerJob}</td>
      <td>{os.isPricedByUnit ? "Unit" : "Kilogram"}</td>
      <td>{os.variableCost}</td>
      <td>
        <button type="button" onClick={() => handleLoadOutsourcing(i)}>Load</button>
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
          <th>Minimum cost per job</th>
          <th>Priced by</th>
          <th>Variable cost</th>
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

    <button type="submit" onClick={handleSaveOutsourcing}>
      Save Outsourcing
    </button>
   </>
  );
}

export default Outsourcings;
