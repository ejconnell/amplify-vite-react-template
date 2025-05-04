import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import L10n from './L10n';
import { TabLabels } from "./TabLabels";
import { IMetal, IMetalFamily } from "./Types";

function Metals({metals, metalFamilies, saveMetal}: {metals: IMetal[], metalFamilies: IMetalFamily[], saveMetal: (metal: IMetal) => void}) {
  const [name, setName] = useState<string>("");
  const [metalFamilyName, setMetalFamilyName] = useState<string>("");
  const [density, setDensity] = useState<string>("");

  function importerProcessorFunc(grid: string[][]) {
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
        metalFamilyName: metalFamilyName,
        density: density,
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
    if (!density || isNaN(Number(density))) {
      alert("Need a numeric density");
      return;
    }
    saveMetal({
      name: name,
      metalFamilyName: metalFamilyName,
      density: density,
    })
  };

  function handleLoadMetal(index: number) {
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
          <th>{L10n.name.chinese} Name</th>
          <th>{L10n.metalFamily.chinese} Metal Family</th>
          <th>{L10n.density.chinese}Density (g/mm<sup>3</sup>)</th>
          <th>{L10n.load.chinese}Load</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  </>);

  const currentMetalFrag = (<>
    <label>{L10n.name.chinese} Name:</label>
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <br/>

    <label>{L10n.metalFamily.chinese}Metal Family:</label>
    <select
      value={metalFamilyName}
      onChange={e => setMetalFamilyName(e.target.value)}
    >
      <option value=""></option>
      {mfSelectOptionsFrag}
    </select>
    <br/>

    <label>{L10n.density.chinese} Density (g/mm<sup>3</sup>):</label>
    <input
      value={density}
      onChange={e => setDensity(e.target.value)}
    />
    <br/>

    <button type="submit" onClick={handleSaveMetal}>
      {L10n.save.chinese}{L10n.metal.chinese} Save Metal
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
      label={TabLabels.metal}
    />
  </>);
}

export default Metals;
