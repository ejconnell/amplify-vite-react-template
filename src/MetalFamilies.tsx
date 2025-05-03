import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Trifold from "./Trifold";
import Labels from "./Labels";

function MetalFamilies({metalFamilies, saveMetalFamily}) {
  const [name, setName] = useState<string>("");

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
           <th>{Labels.name.chinese} Name</th>
         </tr>
      </thead>
      <tbody>
        {mfRowsFrag}
      </tbody>
    </Table>
  </>);

  const currentMetalFamilyFrag = (<>
    <label>{Labels.name.chinese} Name:</label>
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <br/>
    <button type="submit" onClick={handleSaveMetalFamily}>
      {Labels.save.chinese}{Labels.metalFamily.chinese} Save Metal Family
    </button>
  </>);

  return (
    <Trifold
      top={allMetalFamiliesFrag}
      middle={currentMetalFamilyFrag}
      bottom=""
      label={Labels.metalFamily}
    />
  );
}

export default MetalFamilies;
