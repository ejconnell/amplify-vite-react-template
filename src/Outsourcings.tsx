import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import Labels from "./Labels";

function Outsourcings({outsourcings, saveOutsourcing}) {
  const [name, setName] = useState("");
  const [isPricedByUnit, setIsPricedByUnit] = useState(false);
  const [variableCost, setVariableCost] = useState("");
  const [minCostPerJob, setMinCostPerJob] = useState("");

  const variableCostStr = isPricedByUnit ? "unit" : "kilogram";
  const variableCostLabel = isPricedByUnit ? Labels.minCostPerUnit.chinese + "Minimum cost per unit" : Labels.minCostPerKg.chinese + "Minimum cost per kilogram";

  function handleSaveOutsourcing() {
    if (!name) {
      alert("Need a Name");
      return;
    }
    if (!variableCost || isNaN(Number(variableCost))) {
      alert(`Need a numeric cost per ${variableCostStr}`);
      return;
    }
    if (isNaN(Number(minCostPerJob))) {
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

  function importerProcessorFunc(grid) {
    grid.forEach((row, i) => {
      if ((row.length < 3) || (row.length > 4)) {
        alert(`Import failed on row ${i+1}.  Expected exactly 3-4 columns`);
        return;
      }
      const [name, variableCost, minCostPerJob, isPricedByUnit] = row;
      if (!name) {
        return;
      }
      saveOutsourcing({
        name: name,
        variableCost: Number(variableCost),
        minCostPerJob: Number(minCostPerJob),
        isPricedByUnit: isPricedByUnit?.toLowerCase() === "true",
      });
    });
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

  const importerInstructionsText = `Paste 3-4 columns with no header:
  Column 1: name
  Column 2: min cost per kg (or unit)
  Column 3: min cost per job
  Column 4: (optional) "true" if priced by unit or "false"
            if priced by kg.  Defaults to "false"

    --------------------------------|
    | name1 | 25   | 50   | "true"  |
    | name2 | 35   | 150  |         |
    | name3 | 15   | 500  | "false" |
    | ...   |
  `;

  const allOutsourcingsFrag = (<>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{Labels.name.chinese} Name</th>
          <th>{Labels.minCostPerJob.chinese} Minimum cost per job</th>
          <th>{Labels.pricedBy.chinese} Priced by</th>
          <th>{Labels.costPerKgUnit.chinese} Cost per kg/unit</th>
          <th>{Labels.load.chinese} Load</th>
        </tr>
      </thead>
      <tbody>
        {outsourcingsRowsFrag}
      </tbody>
    </Table>
  </>);

  const currentOutsourcingFrag = (<>
    <label>{Labels.name.chinese} Name:</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <br/>

    <label>{Labels.minCostPerJob.chinese} Minimum Cost per job:</label>
    <input
      value={minCostPerJob}
      onChange={(e) => setMinCostPerJob(e.target.value)}
    />
    <br/>

    <label>{Labels.pricedByUnit.chinese} Priced by unit:</label>
    <input
      type="checkbox"
      name="isPricedByUnit"
      checked={isPricedByUnit}
      onChange={() => setIsPricedByUnit(!isPricedByUnit) }
    />
    <br/>

    <label>{variableCostLabel}:</label>
    <input
      value={variableCost}
      onChange={(e) => setVariableCost(e.target.value)}
    />
    <br/>

    <button type="submit" onClick={handleSaveOutsourcing}>
      {Labels.save.chinese}{Labels.outsourcing.chinese} Save Outsourcing
    </button>
  </>);

  const administrationFrag = (<>
    <Importer
      instructionsText={importerInstructionsText}
      buttonText="Save Outsourcings"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (<>
    <Trifold
      top={allOutsourcingsFrag}
      middle={currentOutsourcingFrag}
      bottom={administrationFrag}
      label={Labels.outsourcing}
    />
  </>);
}

export default Outsourcings;
