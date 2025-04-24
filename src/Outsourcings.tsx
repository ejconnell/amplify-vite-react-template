import { useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";

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

  return (
   <>
    <Accordion defaultActiveKey={["all", "current"]} alwaysOpen>
      <Accordion.Item eventKey="all">
        <Accordion.Header>All Outsourcings</Accordion.Header>
        <Accordion.Body>

          <Table bordered striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>Minimum cost per job</th>
                <th>Priced by</th>
                <th>Cost per kg/unit</th>
                <th>Load</th>
              </tr>
            </thead>
            <tbody>
              {outsourcingsRowsFrag}
            </tbody>
          </Table>

        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="current">
        <Accordion.Header>Current Outsourcing</Accordion.Header>
        <Accordion.Body>

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
          <br/>

          <label>Minimum cost per {variableCostLabel}:</label>
          <input
            value={variableCost}
            onChange={(e) => setVariableCost(e.target.value)}
          />
          <br/>

          <button type="submit" onClick={handleSaveOutsourcing}>
            Save Outsourcing
          </button>

        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="administration">
        <Accordion.Header>Administration</Accordion.Header>
        <Accordion.Body>

          <Importer
            instructionsText={importerInstructionsText}
            buttonText="Save Outsourcings"
            processorFunc={importerProcessorFunc}
          />

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
   </>
  );
}

export default Outsourcings;
