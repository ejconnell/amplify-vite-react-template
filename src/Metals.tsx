import { useState } from "react";

function Metals({metals, metalFamilies, addMetal}) {
  const [name, setName] = useState("");
  const [metalFamilyName, setMetalFamilyName] = useState("");
  const [density, setDensity] = useState(0);

  function handleAddMetal() {
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
    addMetal({
      name: name,
      metalFamilyName: metalFamilyName,
      density: parseFloat(density),
    })
  };

  function handleViewEdit(index) {
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
      <td><button type="button" onClick={() => handleViewEdit(i)}>View/Edit</button></td>
    </tr>
  );

  const mfSelectOptionsFrag = metalFamilies.map(mf => {
     return <option value={mf.name} key={mf.name}>{mf.name}</option>;
  });

  return (
   <>
    <h1>Metals page</h1>
    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
          <th>Metal Family</th>
          <th>Density (g/mm^3)</th>
          <th>View/Edit</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </table>

    <div border="1px solid black">
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

      <button type="submit" onClick={handleAddMetal}>
        Add Metal
      </button>
     </div>
   </>
  );
}

export default Metals;
