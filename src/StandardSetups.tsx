import { useState } from "react";

function StandardSetups({standardSetups, addStandardSetup}) {
  const [standardSetupName, setStandardSetupName] = useState("");

  function onSubmit() {
    addStandardSetup({
      name: standardSetupName,
    });
  }

  const tableRows = standardSetups.map(ss =>
    <tr>
      <td>{ss.name}</td>
    </tr>
  );

  return (
   <>
    <h1>Standard Setups page</h1>

    <table border="1px solid black">
      <tr>
        <th>Name</th>
      </tr>
      {tableRows}
    </table>

    <label>Standard Setup Name:</label>
    <input
      value={standardSetupName}
      onChange={(e) => setStandardSetupName(e.target.value)}
    />
    <button type="submit" onClick={onSubmit}>
      Add Standard Setup
    </button>
   </>
  );
}

export default StandardSetups;
