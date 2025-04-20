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

export class MaterialModel {
  constructor(metals, metalName, shapeName, width, innerWidth, rawCost, markup) {
    const metal = metals.find(m => m.name === metalName)
    const shape = Shapes.find(s => s.name === shapeName)

    this.autoName = this.buildAutoName(metalName, shape, width, innerWidth);
    this.density = metal?.density || 0;
    this.hasInnerWidth = shape?.hasInnerWidth || false;
    this.widthLabel = shape?.widthLabel || "-";
    this.crossSectionArea = shape?.area(width, innerWidth) || 0;
    console.log(`${shape.name} ${width} ${innerWidth} ${this.crossSectionArea}`);
    this.weightPerMm = (this.density * this.crossSectionArea) || 0;
    this.effectiveCost = (rawCost + (rawCost * markup / 100)) || 0;
  }

  buildAutoName(metalName, shape, width, innerWidth) {
    if (!metalName) return "-";
    let str = `${metalName} ${width}`;
    if (!shape) return str;
    if (shape.hasInnerWidth) {
      str += `-${innerWidth}`
    }
    str += "mm"
    if (shape.abbreviation) {
      str += ` ${shape.abbreviation}`
    }
    return str;
  }
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


  const materialModel = new MaterialModel(metals, metalName, shapeName, width, innerWidth, Number(rawCost), markup);
  const mergedName = isNameManual ? name : materialModel.autoName;

  const materialsModels = materials.map(m => {
    return new MaterialModel(metals, m.metalName, m.shapeName, m.width, m.innerWidth, m.rawCost, m.markup);
  });

  function handleAddMaterial() {
    if (!mergedName) {
      alert("Need a Name");
      return;
    }
    if (!metalName) {
      alert("Need a Metal");
      return;
    }
    if (!shapeName) {
      alert("Need a Shape");
      return;
    }
    if (!width || isNaN(width)) {
      alert("Need a numeric Width");
      return;
    }
    if (!rawCost || isNaN(rawCost)) {
      alert("Need a numeric Raw Cost");
      return;
    }
    if (!markup || isNaN(markup)) {
      alert("Need a numeric Markup");
      return;
    }
    if (materialModel.hasInnerWidth && (!innerWidth || isNaN(innerWidth))) {
      alert("Need a numeric Inner Width");
      return;
    }

    const material = {
      name: mergedName,
      isNameManual: isNameManual,
      metalName: metalName,
      shapeName: shapeName,
      width: Number(width),
      rawCost: Number(rawCost),
      markup: Number(markup),
    };
    if (materialModel.hasInnerWidth) {
      material.innerWidth = Number(innerWidth);
    }
    addMaterial(material);
  };

  function handleViewEdit(index) {
     const material = materials[index];
     setName(material.name);
     setIsNameManual(material.isNameManual);
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
      <td>{materialsModels[i].weightPerMm.toFixed(4)}</td>
      <td>{m.rawCost.toFixed(4)}</td>
      <td>{m.markup}</td>
      <td>{materialsModels[i].effectiveCost.toFixed(4)}</td>
      <td><button type="button" onClick={() => handleViewEdit(i)}>View/Edit</button></td>
    </tr>
  );

  const innerWidthFragment = (
   <>
    <label>Inner {materialModel.widthLabel} (mm):</label>
    <input
      value={innerWidth}
      onChange={(e) => setInnerWidth(e.target.value)}
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
      value={mergedName}
      onChange={(e) => setName(e.target.value)}
      disabled={!isNameManual}
    />
    &nbsp;
    <label>Use Manual Name:</label>
    <input
      type="checkbox"
      name="isNameManual"
      checked={isNameManual}
      onChange={(e) => setIsNameManual(!isNameManual) }
    />
    <br/>

    <label>Metal:</label>
    <select
      value={metalName}
      onChange={e => setMetalName(e.target.value)}
    >
      <option value="" key=""></option>;
      {metalSelectOptions}
    </select>
    &nbsp;
    <label>Density: {materialModel.density || "-"} g/mm^3</label>
    <br/>

    <label>Shape:</label>
    <select
      value={shapeName}
      onChange={e => setShapeName(e.target.value)}
    >
      {shapeSelectOptions}
    </select>
    <br/>

    <label>{materialModel.widthLabel} (mm):</label>
    <input
      value={width}
      onChange={(e) => setWidth(e.target.value)}
    />
    {materialModel.hasInnerWidth && innerWidthFragment}
    &nbsp; &nbsp;
    <label>Cross section area (mm^2): {materialModel.crossSectionArea.toFixed(4)}</label>
    &nbsp; &nbsp;
    <label>Weight per mm (g/mm): {materialModel.weightPerMm.toFixed(4)}</label>
    <br/>

    <label>Raw Cost:</label>
    <input
      value={rawCost}
      onChange={(e) => setRawCost(e.target.value)}
    />
    <label>Markup %:</label>
    <input
      value={markup}
      onChange={(e) => setMarkup(e.target.value)}
    />
    <label>Effective Cost: {materialModel.effectiveCost}</label>
    <br/>

    <button type="submit" onClick={handleAddMaterial}>
      Add Material
    </button>
    <br/>
   </>
  );
}

export default Materials;
