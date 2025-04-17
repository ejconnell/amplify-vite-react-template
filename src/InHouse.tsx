import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function InHouse({inHouses, addInHouse}) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);

  const tableRows = inHouses.map(m =>
    <tr>
      <td>{m.name}</td>
      <td>{m.cost}</td>
    </tr>
  );

  function onSubmit() {
    addInHouse({
      name: name,
      cost: cost,
    });
  }

  return (<>
    <h1>In House Costs</h1>
    <table border="1px solid black">
      <thead>
        <th>Name</th>
        <th>Cost</th>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </table>

    <label>Name:</label>
    <input value={name} onChange={(e) => setName(e.target.value)}/>
    <br/>
    <label>Cost:</label>
    <input value={cost} onChange={(e) => setCost(parseFloat(e.target.value))}/>
    <br/>
    <button type="submit" onClick={onSubmit}>
      Add In House
    </button>
  </>);
}

export default InHouse;
