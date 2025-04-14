import { useState } from "react";

function MetalFamilies({metalFamilies, addMetalFamily}) {
  const [inputText, setInputText] = useState("");

  const log = (msg) => console.log(`[SCENARIO] ${msg}`);

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
    <h1>Metal Families</h1>
    <ul>{mfItems}</ul>

    <input value={inputText} onChange={handleInputTextChange}/>
    <button type="submit" onClick={onSubmit}>
      Add Metal Family
    </button>
   </>
  );
}

export default MetalFamilies;
