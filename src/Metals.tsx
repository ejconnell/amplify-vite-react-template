import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import Labels from './Labels';

function Metals({metals, metalFamilies, saveMetal}) {
  const [name, setName] = useState("");
  const [metalFamilyName, setMetalFamilyName] = useState("");
  const [density, setDensity] = useState(0);

  function importerProcessorFunc(grid) {
    grid.forEach((row, i) => {
      if ((row.length < 2) || (row.length > 3)) {
        alert(`Import failed on row ${i+1}.  Expected exactly 2-3 columns`);
        return;
      }
      const [name, density, metalFamilyName] = row;
      if (!name) {
        return;
      }
      saveMetal({
        name: name,
        metalFamilyName: metalFamilyName || metalFamilies[0].name,
        density: Number(density),
      });
    });
  }

  function handleSaveMetal() {
    if (!name) {
      alert("Need a Name");
      return;
    }
    if (!metalFamilyName) {
      alert("Need to select a Metal Family");
      return;
    }
    if (!density || isNaN(density)) {
      alert("Need a numeric density");
      return;
    }
    saveMetal({
      name: name,
      metalFamilyName: metalFamilyName,
      density: Number(density),
    })
  };

  function handleLoadMetal(index) {
     const metal = metals[index];
     setName(metal.name);
     setMetalFamilyName(metal.metalFamilyName);
     setDensity(metal.density);
  };

  const tableRows = metals.map((m, i) =>
    <tr key={m.name}>
      <td>{m.name}</td>
      <td>{m.metalFamilyName}</td>
      <td>{m.density}</td>
      <td><button type="button" onClick={() => handleLoadMetal(i)}>Load</button></td>
    </tr>
  );

  const mfSelectOptionsFrag = metalFamilies.map(mf => {
     return <option value={mf.name} key={mf.name}>{mf.name}</option>;
  });

  const allMetalsFrag = (<>
    <Table bordered striped>
      <thead>
        <tr>
          <th>Name</th>
          <th>Metal Family</th>
          <th>Density (g/mm^3)</th>
          <th>Load</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  </>);

  const currentMetalFrag = (<>
    <label>Name:</label>
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />

    <label>Metal Family:</label>
    <select
      value={metalFamilyName}
      onChange={e => setMetalFamilyName(e.target.value)}
    >
      <option value=""></option>
      {mfSelectOptionsFrag}
    </select>

    <label>Density:</label>
    <input
      value={density}
      onChange={e => setDensity(e.target.value)}
    />

    <button type="submit" onClick={handleSaveMetal}>
      Save Metal
    </button>
  </>);

  const importerInstructionsText = `Paste 2-3 columns with no header:
  Column 1: name
  Column 2: density
  Column 3: metal family (optional).  Defaults to
            alphabetically first metal family.

    --------------------------|
    | C3604B | 50   |         |
    | C2700T | 150  | Copper  |
    | ...    |      
  `;

  const administrationFrag = (<>
    <Importer
      instructionsText={importerInstructionsText}
      buttonText="Save Metals"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (<>
    <Trifold
      top={allMetalsFrag}
      middle={currentMetalFrag}
      bottom={administrationFrag}
      label={Labels.metal}
    />
  </>);
}

export default Metals;
