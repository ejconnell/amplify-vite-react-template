import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

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

  const tableRows = inHouses.map((m, i) =>
    <tr key={m.name}>
      <td>{m.name}</td>
      <td>{m.cost}</td>
      <td><button type="button" onClick={() => handleLoadInHouse(i)}>Load</button></td>
    </tr>
  );

  return (<>
    <h1>In Houses</h1>
    <table border="1px solid black">
      <thead>
        <th>Name</th>
        <th>Cost</th>
        <th>Load</th>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </table>

    <label>Name:</label>
    <input value={name} onChange={(e) => setName(e.target.value)}/>
    <br/>
    <label>Cost:</label>
    <input value={cost} onChange={(e) => setCost(e.target.value)}/>
    <br/>
    <button type="submit" onClick={handleSaveInHouse}>
      Save In House
    </button>
  </>);
}

export default InHouses;
