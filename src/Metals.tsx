import { useState } from "react";

function Metals({metals=[], metalFamilies=[], addMetal}) {
  const [nameInput, setNameInput] = useState("");
  const [selectedMetalFamily, setSelectedMetalFamily] = useState(metalFamilies[0]);
  const [densityInput, setDensityInput] = useState(0);

  const log = (msg) => console.log(`[SCENARIO] ${msg}`);

  const tableRows = metals.map(m => 
    <tr>
      <td>{m.name}</td>
      <td>{m.metalFamily}</td>
      <td>{m.density}</td>
    </tr>
  );

  const mfSelectOptions = metalFamilies.map(mf => {
     return <option value={mf}>{mf}</option>;
  });

  function handleNameInputChange(e) {
    setNameInput(e.target.value);
  }

  function handleDensityInputChange(e) {
    setDensityInput(e.target.value);
  }

  function onSubmit() {
    addMetal({
      name: nameInput,
      metalFamily: selectedMetalFamily,
      density: parseFloat(densityInput),
    })
    setNameInput("")
    setDensityInput(0)
  }

  return (
   <>
    <h1>Metals page</h1>
    <table border="1px solid black">
      <tr>
        <th>Name</th>
        <th>Metal Family</th>
        <th>Density (g/mm^3)</th>
      </tr>
      {tableRows}
    </table>
    <div border="1px solid black">
      <label>Name:</label>
      <input value={nameInput} onChange={handleNameInputChange}/>
      <label>Metal Family:</label>
      <select
        value={selectedMetalFamily}
        onChange={e => setSelectedMetalFamily(e.target.value)}
      >
        {mfSelectOptions}
      </select>
      <label>Density:</label>
      <input value={densityInput} onChange={handleDensityInputChange}/>
      <button type="submit" onClick={onSubmit}>
        Add Metal
      </button>
     </div>
   </>
  );
}

export default Metals;
