import { useState } from "react";

const Shapes = [
  {
    name: "Cylindrical",
    hasInnerWidth: false,
    abbreviation: "",
    widthLabel: "Diameter",
    area: (width) => Math.PI * width * width / 4,
  },
  {
    name: "Hollow Cylindrical",
    hasInnerWidth: true,
    abbreviation: "",
    widthLabel: "Diameter",
    area: (width, innerWidth) => (Math.PI * width * width / 4) - (Math.PI * innerWidth * innerWidth / 4),
  },
  {
    name: "Square",
    hasInnerWidth: false,
    abbreviation: "Sq",
    widthLabel: "Side",
    area: (width) => width * width,
  },
  {
    name: "Hollow Square",
    hasInnerWidth: true,
    abbreviation: "Sq",
    widthLabel: "Side",
    area: (width, innerWidth) => (width * width) - (innerWidth * innerWidth),
  },
  {
    name: "Hexagonal",
    hasInnerWidth: false,
    abbreviation: "Hex",
    widthLabel: "Side",
    area: (width) => Math.sqrt(3) / 2 * width * width,
  },
];

function buildAutoName(metalName, shapeObj, width, innerWidth) {
  let str = `${metalName} ${width}`;
  if (shapeObj.hasInnerWidth) {
    str += `-${innerWidth}`
  }
  str += "mm"
  if (shapeObj.abbreviation) {
    str += ` ${shapeObj.abbreviation}`
  }
  return str;
}

function Materials({materials, metals, metalFamilies, addMaterial}) {
  const [isNameManual, setIsNameManual] = useState(false);
  const [name, setName] = useState("");
  const [metalName, setMetalName] = useState("");
  const [shapeName, setShapeName] = useState(Shapes[0].name);
  const [width, setWidth] = useState(0);
  const [innerWidth, setInnerWidth] = useState(0);
  const [rawCost, setRawCost] = useState(0);
  const [markup, setMarkup] = useState(6.5);

  const shapeObj = Shapes.find(s => s.name === shapeName) || Shapes[0];
  const autoName = buildAutoName(metalName, shapeObj, width, innerWidth);
  const density = metals.find(m => m.name === metalName)?.density;
  const crossSectionArea = shapeObj.area(width, innerWidth);
  const weightPerMm = density * crossSectionArea;
  const effectiveCost = rawCost + (rawCost * markup / 100);

  function handleAddMaterial() {
    const material = {
      name: isNameManual ? name : autoName,
      metalName: metalName,
      shapeName: shapeName,
      width: width,
      weightPerMm: weightPerMm,
      rawCost: rawCost,
      markup: markup,
      effectiveCost: effectiveCost,
    };
    if (shapeObj.hasInnerWidth) {
      material.innerWidth = innerWidth
    }
    addMaterial(material);
  };

  function handleViewEdit(index) {
     const material = materials[index];
     setName(material.name);
     setIsNameManual(material.isNameManual || false);
     setMetalName(material.metalName);
     setShapeName(material.shapeName);
     setWidth(material.width);
     setInnerWidth(material.innerWidth || 0);
     setRawCost(material.rawCost);
     setMarkup(material.markup);
  };

  const tableRows = materials.map((m, i) =>
    <tr key={m.name}>
      <td>{m.name}</td>
      <td>{m.metalName}</td>
      <td>{m.shapeName}</td>
      <td>{m.width}</td>
      <td>{m.innerWidth || "-"}</td>
      <td>{m.weightPerMm.toFixed(4)}</td>
      <td>{m.rawCost.toFixed(4)}</td>
      <td>{m.markup}</td>
      <td>{m.effectiveCost.toFixed(4)}</td>
      <td><button type="button" onClick={() => handleViewEdit(i)}>View/Edit</button></td>
    </tr>
  );

  let nameFragment;
  if (isNameManual) {
     nameFragment = <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  } else {
     nameFragment = <label>{autoName}</label>;
  }

  const innerWidthFragment = (
   <>
    <label>Inner {shapeObj.widthLabel} (mm):</label>
    <input
      value={innerWidth}
      onChange={(e) => setInnerWidth(parseFloat(e.target.value))}
    />
   </>);

  const metalSelectOptions = metals.map(m => {
     return <option value={m.name} key={m.name}>{m.name}</option>;
  });

  const shapeSelectOptions = Shapes.map(s => {
     return <option value={s.name} key={s.name}>{s.name}</option>;
  });

  return (
   <>
    <h1>Materials</h1>
    <table border="1px solid black">
      <thead>
        <tr>
          <th>Name</th>
          <th>Metal</th>
          <th>Shape</th>
          <th>Width (mm)</th>
          <th>Inner Width (mm)</th>
          <th>Weight per mm (g/mm)</th>
          <th>Raw Cost ($/kg)</th>
          <th>Markup %</th>
          <th>Effective Cost ($/kg)</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </table>

    <label>Name:</label>
    <input
      value={isNameManual ? name : autoName}
      onChange={(e) => setName(e.target.value)}
      disabled={!isNameManual}
    />
    &nbsp;
    <label>Use Manual Name:</label>
    <input
      type="checkbox"
      name="isNameManual"
      defaultChecked={isNameManual}
      onChange={(e) => setIsNameManual(!isNameManual) }
    />
    <br/>

    <label>Metal:</label>
    <select
      value={metalName}
      onChange={e => setMetalName(e.target.value)}
    >
      {metalSelectOptions}
    </select>
    &nbsp;
    <label>Density: {density} g/mm^3</label>
    <br/>

    <label>Shape:</label>
    <select
      value={shapeName}
      onChange={e => setShapeName(e.target.value)}
    >
      {shapeSelectOptions}
    </select>
    <br/>
   

    <label>{shapeObj.widthLabel} (mm):</label>
    <input
      value={width}
      onChange={(e) => setWidth(parseFloat(e.target.value))}
    />
    {shapeObj.hasInnerWidth && innerWidthFragment}
    &nbsp; &nbsp;
    <label>Cross section area (mm^2): {crossSectionArea.toFixed(4)}</label>
    &nbsp; &nbsp;
    <label>Weight per mm (g/mm): {weightPerMm.toFixed(4)}</label>
    <br/>

    <label>Raw Cost:</label>
    <input
      value={rawCost}
      onChange={(e) => setRawCost(parseFloat(e.target.value))}
    />
    <label>Markup %:</label>
    <input
      value={markup}
      onChange={(e) => setMarkup(parseFloat(e.target.value))}
    />
    <label>Effective Cost: {effectiveCost}</label>
    <br/>


    <button type="submit" onClick={handleAddMaterial}>
      Add Material
    </button>
    <br/>
   </>
  );
}

export default Materials;
