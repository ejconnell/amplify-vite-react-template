import { useState } from "react";

function StandardSetups({standardSetups, saveStandardSetup}) {
  const [standardSetupName, setStandardSetupName] = useState("");

  function handleSaveStandardSetup() {
    saveStandardSetup({
      name: standardSetupName,
    });
  }

  const tableRows = standardSetups.map(ss =>
    <tr key={ss.name}>
      <td>{ss.name}</td>
    </tr>
  );

  return (
   <>
    <h1>Standard Setups page</h1>

    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </table>

    <label>Standard Setup Name:</label>
    <input
      value={standardSetupName}
      onChange={(e) => setStandardSetupName(e.target.value)}
    />
    <button type="submit" onClick={handleSaveStandardSetup}>
      Save Standard Setup
    </button>
   </>
  );
}

export default StandardSetups;
