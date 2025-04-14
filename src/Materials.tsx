import { useState } from "react";

function Materials({materials, metals, metalFamilies, addMaterial}) {
  const [isNameManual, setIsNameManual] = useState(false);
  const [name, setName] = useState("");
  const [metal, setMetal] = useState(metals[0]);
  const [density, setDensity] = useState(0);
  const [rawCost, setRawCost] = useState(0);
  const [markup, setMarkup] = useState(6.5);

  const effectiveCost = rawCost * markup;

  const log = (msg) => console.log(`[SCENARIO] ${msg}`);

  const tableRows = "";
  const mfItems = metalFamilies.map(mf => 
    <li>{mf}</li>
  );

  function handleInputTextChange(e) {
    setInputText(e.target.value);
  }

  function onSubmit() {
    addMetalFamily(inputText)
    setInputText("")
  }

  
  return (
   <>
    <h1>Materials</h1>
    <table border="1px solid black">
      <tr>
        <th>Name</th>
        <th>Metal</th>
        <th>Size (mm)</th>
        <th>Shape</th>
        <th>Density (g/mm^3)</th>
        <th>Raw Cost</th>
        <th>Markup</th>
        <th>Effective Cost</th>
      </tr>
      {tableRows}
    </table>

    <input onChange={handleInputTextChange}/>
    <button type="submit" onClick={onSubmit}>
      Add Material
    </button>
   </>
  );
}

export default Materials;
