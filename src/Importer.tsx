import { useState } from "react";

function Importer({instructionsText, buttonText, processorFunc}) {
  const [userText, setUserText] = useState("");

  function handleButtonClick() {
    // When a Google Sheet cell has a line break, it is pasted as a quoted
    // string with an internal newline.  We dequote and merge these lines
    // to get intended TSV data.
    function dequoteAndMergeLines(lines) {
      const dequotedLines = [];
      let arePreviousLinesMatched = true;
      lines.forEach(line => {
        //const noQuotesLine = line.replaceAll("\"", "");
        const splitSegments = line.split("\"");
        const numQuotes = splitSegments.length -1;
        const noQuotesLine = splitSegments.join(" ");
        const isCurrentLineMatched = (numQuotes % 2) == 0;
        if (arePreviousLinesMatched) {
          dequotedLines.push(noQuotesLine);
          arePreviousLinesMatched = isCurrentLineMatched
        } else {
          const lastIndex = dequotedLines.length - 1;
          dequotedLines[lastIndex] = dequotedLines[lastIndex].concat(noQuotesLine);
          arePreviousLinesMatched = !isCurrentLineMatched
        }
      })
      return dequotedLines;
    }

    const initialLines = userText.split("\n");
    const dequotedLines = dequoteAndMergeLines(initialLines);
    const grid = dequotedLines.map(row => {
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
