import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import Labels from "./Labels";

function InHouses({inHouses, saveInHouse}) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);

  function handleSaveInHouse() {
    if (!name) {
      alert("Need a name");
      return;
    }
    if (isNaN(cost)) {
      alert("Need a numeric cost");
      return;
    }
    saveInHouse({
      name: name,
      cost: Number(cost),
    });
  }

  function handleLoadInHouse(index) {
    const inHouse = inHouses[index];
    setName(inHouse.name);
    setCost(inHouse.cost);
  }

  function importerProcessorFunc(grid) {
    grid.forEach((row, i) => {
      if (row.length !== 2) {
        alert(`Import failed on row ${i+1}.  Expected exactly 2 columns`);
        return;
      }
      const [name, cost] = row;
      if (!name) {
        alert(`Import failed on row ${i+1}.  Need a name.`);
        return;
      }
      if (isNaN(cost)) {
        alert(`Import failed on row ${i+1}.  Need a numeric cost.`);
        return;
      }
      saveInHouse({
        name: name,
        cost: Number(cost),
      });
    });
  }

  const tableRows = inHouses.map((m, i) =>
    <tr key={m.name}>
      <td>{m.name}</td>
      <td>{m.cost}</td>
      <td><button type="button" onClick={() => handleLoadInHouse(i)}>Load</button></td>
    </tr>
  );

  const importerInstructionsText = `Paste 2 columns with no header:
  Column 1: name
  Column 2: cost per 1k

    ----------------
    | name1 | 25   |
    | name2 | 35   |
    | name3 | 15   |
    | ...   |      |
  `;

  const allInHousesFrag = (<>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{Labels.name.chinese} Name</th>
          <th>{Labels.costPerThousand.chinese} Cost per 1k</th>
          <th>{Labels.load.chinese} Load</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  </>);

  const currentInHouseFrag = (<>
    <label>{Labels.name.chinese} Name:</label>
    <input value={name} onChange={(e) => setName(e.target.value)}/>
    <br/>
    <label>{Labels.costPerThousand.chinese} Cost per 1k:</label>
    <input value={cost} onChange={(e) => setCost(e.target.value)}/>
    <br/>
    <button type="submit" onClick={handleSaveInHouse}>
      {Labels.save.chinese}{Labels.inHouse.chinese} Save In House
    </button>
  </>);

  const administrationFrag = (<>
    <Importer
      instructionsText={importerInstructionsText}
      buttonText="Save In Houses"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (<>
    <Trifold
      top={allInHousesFrag}
      middle={currentInHouseFrag}
      bottom={administrationFrag}
      label={Labels.inHouse}
    />
  </>);
}

export default InHouses;
