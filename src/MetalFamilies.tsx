import { useState } from "react";

function MetalFamilies({metalFamilies, saveMetalFamily}) {
  const [name, setName] = useState("");

  const mfRowsFrag = metalFamilies.map(mf => {
    return <tr key={mf.name}>
      <td>{mf.name}</td>
    </tr>
  });

  function handleSaveMetalFamily() {
    const metalFamily = {
      name: name,
    };
    saveMetalFamily(metalFamily)
  };

  return (
   <>
    <h1>Metal Families</h1>
    <table border="1px solid black">
      <thead>
         <tr>
           <th>Name</th>
         </tr>
      </thead>
      <tbody>
        {mfRowsFrag}
      </tbody>
    </table>

    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <button type="submit" onClick={handleSaveMetalFamily}>
      Save Metal Family
    </button>
   </>
  );
}

export default MetalFamilies;
