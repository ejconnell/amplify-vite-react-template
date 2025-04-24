import { useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";

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

  return (
   <>
    <Accordion defaultActiveKey={["all", "current"]} alwaysOpen>
      <Accordion.Item eventKey="all">
        <Accordion.Header>All Standard Setups</Accordion.Header>
        <Accordion.Body>

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

        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="current">
        <Accordion.Header>Current Standard Setup</Accordion.Header>
        <Accordion.Body>

          <label>Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br/>
          <button type="submit" onClick={handleSaveStandardSetup}>
            Save Standard Setup
          </button>

        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="administration">
        <Accordion.Header>Administration</Accordion.Header>
        <Accordion.Body>

          <Importer
            instructionsText={importerInstructionsText}
            buttonText="Save Standard Setups"
            processorFunc={importerProcessorFunc}
          />

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
   </>
  );
}

export default StandardSetups;
