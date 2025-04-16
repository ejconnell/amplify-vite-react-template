import { useState } from "react";

const Shapes = [
  {
    name: "Cylindrical",
    hasInnerWidth: false,
    english: "Cylindrical",
    abbreviation: "",
    widthLabel: "Diameter",
    area: (width) => Math.PI * width * width / 4,
  },
  {
    name: "HollowCylindrical",
    hasInnerWidth: true,
    english: "Hollow Cylindrical",
    abbreviation: "",
    widthLabel: "Diameter",
    area: (width, innerWidth) => (Math.PI * width * width / 4) - (Math.PI * innerWidth * innerWidth / 4),
  },
  {
    name: "Square",
    hasInnerWidth: false,
    english: "Square",
    abbreviation: "Sq",
    widthLabel: "Side",
    area: (width) => width * width,
  },
  {
    name: "HollowSquare",
    hasInnerWidth: true,
    english: "Hollow Square",
    abbreviation: "Sq",
    widthLabel: "Side",
    area: (width, innerWidth) => (width * width) - (innerWidth * innerWidth),
  },
  {
    name: "Hexagonal",
    hasInnerWidth: false,
    english: "Hexagonal",
    abbreviation: "Hex",
    widthLabel: "Side",
    area: (width) => width * width,
  },
];

function buildAutoName(metal, shapeObj, width, innerWidth) {
  console.log("SSSSSSSSSSS")
  let str = `${metal} ${width}`;
  console.log(str);
  console.log(JSON.stringify(shapeObj));
  if (shapeObj.hasInnerWidth) {
    console.log("QQQQQQ");
    str += `-${innerWidth}`
  }
  console.log(str);
  str += "mm"
  console.log(str);
  if (shapeObj.abbreviation) {
    str += ` ${shapeObj.abbreviation}`
  }
  console.log(str);
  return str;
}

function Materials({materials, metals, metalFamilies, addMaterial}) {
  const [isNameManual, setIsNameManual] = useState(false);
  const [name, setName] = useState("");
  const [metal, setMetal] = useState(metals[0] && metals[0].name);
  const [shape, setShape] = useState(Shapes[0].name);
  const [width, setWidth] = useState(0);
  const [innerWidth, setInnerWidth] = useState(0);
  const [rawCost, setRawCost] = useState(0);
  const [markup, setMarkup] = useState(6.5);

  const shapeObj = Shapes.find(s => s.name === shape);
  const autoName = buildAutoName(metal, shapeObj, width, innerWidth);
  const density = metals.find(m => m.name === metal).density;
  const crossSectionArea = shapeObj.area(width, innerWidth);
  const weightPerMm = density * crossSectionArea;
  const effectiveCost = rawCost + (rawCost * markup / 100);

  const log = (msg) => console.log(`[SCENARIO] ${msg}`);

  function onSubmit() {
    const material = {
      name: isNameManual ? name : autoName,
      metal: metal,
      shape: shape,
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

  const tableRows = materials.map(m =>
    <tr>
      <td>{m.name}</td>
      <td>{m.metal}</td>
      <td>{Shapes.find(s => s.name === m.shape).english}</td>
      <td>{m.width}</td>
      <td>{m.innerWidth || "-"}</td>
      <td>{m.weightPerMm.toFixed(4)}</td>
      <td>{m.rawCost.toFixed(4)}</td>
      <td>{m.markup}</td>
      <td>{m.effectiveCost.toFixed(4)}</td>
    </tr>
  );

  function onShapeChange(e) {
    log(`onShapeChange ${e.target.value}`);
    setShape(e.target.value);
  }

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
     return <option value={m.name}>{m.name}</option>;
  });

  const shapeInputs = Shapes.map(s => {
    return <>
      <input
        type="radio"
        name="shape"
        value={s.name}
        defaultChecked={shape === s.name}
      />
      <label>{s.english}</label>
    </>
  });

  log("top")
  log(name);
  log(isNameManual);

  return (
   <>
    <h1>Materials</h1>
    <table border="1px solid black">
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
      {tableRows}
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
      name="isNameManualCheckbox"
      defaultChecked={isNameManual}
      onChange={(e) => setIsNameManual(!isNameManual) }
    />
    <br/>

    <label>Metal:</label>
    <select
      value={metal}
      onChange={e => setMetal(e.target.value)}
    >
      {metalSelectOptions}
    </select>
    &nbsp;
    <label>Density: {density} g/mm^3</label>
    <br/>

    <label>Shape:</label>
    <div onChange={onShapeChange}>
      {shapeInputs}
    </div>
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


    <button type="submit" onClick={onSubmit}>
      Add Material
    </button>
    <br/>
   </>
  );
}

export default Materials;
