import { useState } from "react";

function StandardSetups({standardSetups, saveStandardSetup}) {
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

    <label>Name:</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <br/>
    <button type="submit" onClick={handleSaveStandardSetup}>
      Save Standard Setup
    </button>
   </>
  );
}

export default StandardSetups;
