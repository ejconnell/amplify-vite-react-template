import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Trifold from "./Trifold";
import L10n from "./L10n";
import { TabLabels } from "./TabLabels";
import { IMetalFamily } from "./Types";

function MetalFamilies({metalFamilies, saveMetalFamily}: {metalFamilies: IMetalFamily[], saveMetalFamily: (metalFamily: IMetalFamily) => void}) {
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
           <th>{L10n.name.chinese} Name</th>
         </tr>
      </thead>
      <tbody>
        {mfRowsFrag}
      </tbody>
    </Table>
  </>);

  const currentMetalFamilyFrag = (<>
    <label>{L10n.name.chinese} Name:</label>
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <br/>
    <button type="submit" onClick={handleSaveMetalFamily}>
      {L10n.save.chinese}{L10n.metalFamily.chinese} Save Metal Family
    </button>
  </>);

  return (
    <Trifold
      top={allMetalFamiliesFrag}
      middle={currentMetalFamilyFrag}
      bottom={<></>}
      label={TabLabels.metalFamily}
    />
  );
}

export default MetalFamilies;
