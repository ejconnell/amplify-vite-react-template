import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Trifold from "./Trifold";

function MetalFamilies({metalFamilies, saveMetalFamily}) {
  const [name, setName] = useState("");

  function handleSaveMetalFamily() {
    if (!name) {
      alert("Need a name");
      return;
    }
    const metalFamily = {
      name: name,
    };
    saveMetalFamily(metalFamily)
  };

  const mfRowsFrag = metalFamilies.map(mf => {
    return <tr key={mf.name}>
      <td>{mf.name}</td>
    </tr>
  });

  const allMetalFamiliesFrag = (<>
    <Table bordered striped>
      <thead>
         <tr>
           <th>Name</th>
         </tr>
      </thead>
      <tbody>
        {mfRowsFrag}
      </tbody>
    </Table>
  </>);

  const currentMetalFamilyFrag = (<>
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <br/>
    <button type="submit" onClick={handleSaveMetalFamily}>
      Save Metal Family
    </button>
  </>);

  return (
    <Trifold
      top={allMetalFamiliesFrag}
      middle={currentMetalFamilyFrag}
      bottom=""
      singular="Metal Family"
      plural="Metal Families"
    />
  );
}

export default MetalFamilies;
