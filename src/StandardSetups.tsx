import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import L10n from "./L10n";
import { TabLabels } from "./TabLabels";
import { IStandardSetup } from "./Types";

function StandardSetups({standardSetups, saveStandardSetup}: {standardSetups: IStandardSetup[], saveStandardSetup: (standardSetup: IStandardSetup) => void}) {
  const [name, setName] = useState("");

  function handleSaveStandardSetup() {
    if (!name) {
      alert("Need a name");
      return;
    }
    saveStandardSetup({
      name: name,
    });
  }

  function importerProcessorFunc(grid: string[][]) {
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
          <th>{L10n.name.chinese} Name</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  </>);

  const currentStandardSetupFrag = (<>
    <label>{L10n.name.chinese} Name:</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <br/>
    <button type="submit" onClick={handleSaveStandardSetup}>
      {L10n.save.chinese}{L10n.standardSetup.chinese} Save Standard Setup
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
      label={TabLabels.standardSetup}
    />
  </>);
}

export default StandardSetups;
