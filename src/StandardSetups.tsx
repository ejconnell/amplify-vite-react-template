import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";


function StandardSetups({standardSetups, saveStandardSetup}) {
  const [name, setName] = useState("");
  const [bulkImportText, setBulkImportText] = useState("");

  function handleSaveStandardSetup() {
    if (!name) {
      alert("Need a name");
      return;
    }
    saveStandardSetup({
      name: name,
    });
  }

  function importerProcessorFunc(grid) {
    grid.forEach((row, i) => {
      if (row.length !== 1) {
        alert(`Import failed on row ${i+1}.  Expected exactly 1 columns`);
        return;
      }
      const [name] = row;
      if (!name) {
        return;
      }
      saveStandardSetup({
        name: name,
      });
    });
  }

  const tableRows = standardSetups.map(ss =>
    <tr key={ss.name}>
      <td>{ss.name}</td>
    </tr>
  );

  const importerInstructionsText = `Paste one column with no header:
    ---------
    | name1 |
    | name2 |
    | ...   |
  `;

  const allStandardSetupsFrag = (<>
    <Table bordered striped>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  </>);

  const currentStandardSetupFrag = (<>
    <label>Name:</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <br/>
    <button type="submit" onClick={handleSaveStandardSetup}>
      Save Standard Setup
    </button>
  </>);

  const administrationFrag = (<>
    <Importer
      instructionsText={importerInstructionsText}
      buttonText="Save Standard Setups"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (<>
    <Trifold
      top={allStandardSetupsFrag}
      middle={currentStandardSetupFrag}
      bottom={administrationFrag}
      singular="Standard Setup"
      plural="Standard Setups"
    />
  </>);
}

export default StandardSetups;
