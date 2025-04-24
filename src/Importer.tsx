import { useState } from "react";

function Importer({instructionsText, buttonText, processorFunc}) {
  const [userText, setUserText] = useState("");

  function handleButtonClick() {
    const grid = userText.split("\n").map(row => {
      return row.split("\t");
    });
    processorFunc(grid);
  }

  return (
   <>
     <textarea
       rows="14"
       cols="60"
       placeholder={instructionsText}
       onChange={e => setUserText(e.target.value)}
       style={{fontFamily: "monospace"}}
     />
     <br/>
     <button type="button" onClick={handleButtonClick}>{buttonText}</button>
   </>
  );
}

export default Importer;
