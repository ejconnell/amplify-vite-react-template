import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";

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
  constructor({metals, metalName, shapeName, width, innerWidth, rawCost, markup}) {
    const metal = metals.find(m => m.name === metalName)
    const shape = Shapes.find(s => s.name === shapeName)

    this.autoName = this.buildAutoName(metalName, shape, width, innerWidth);
    this.density = Number(metal?.density);
    this.hasInnerWidth = shape?.hasInnerWidth || false;
    this.widthLabel = shape?.widthLabel || "-";
    this.crossSectionArea = width === "" ? Number.NaN : Number(shape?.area(width, innerWidth));
    this.weightPerMm = Number(this.density * this.crossSectionArea);
    this.effectiveCost = rawCost === "" ? Number.NaN : Number(Number(rawCost) + (rawCost * markup / 100));
  }

  buildAutoName(metalName, shape, width, innerWidth) {
    if (!metalName) return "-";
    let str = `${metalName} ${Number(width).toFixed(1)}`;
    if (!shape) return str;
    if (shape.hasInnerWidth) {
      str += `-${Number(innerWidth).toFixed(1)}`
    }
    str += "mm"
    if (shape.abbreviation) {
      str += ` ${shape.abbreviation}`
    }
    return str;
  }
}

function Materials({materials, metals, metalFamilies, saveMaterial}) {
  const [isNameManual, setIsNameManual] = useState(false);
  const [name, setName] = useState("");
  const [metalName, setMetalName] = useState("");
  const [shapeName, setShapeName] = useState(Shapes[0].name);
  const [width, setWidth] = useState("");
  const [innerWidth, setInnerWidth] = useState("");
  const [rawCost, setRawCost] = useState("");
  const [markup, setMarkup] = useState(6.5);

  const materialModel = new MaterialModel({
    metals: metals,
    metalName: metalName,
    shapeName: shapeName,
    width: width,
    innerWidth: innerWidth,
    rawCost: rawCost,
    markup: markup,
  });
  const mergedName = isNameManual ? name : materialModel.autoName;

  const materialsModels = materials.map(material => {
    return new MaterialModel({
      metals: metals,
      ...material,
    });
  });

  function handleSaveMaterial() {
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
    saveMaterial(material);
  };

  function importerProcessorFunc(grid) {
    const metalNames = metals.map(m => m.name);

    grid.forEach((row, i) => {
      if (row.length !== 4) {
        alert(`Import failed on row ${i+1}.  Expected exactly 4 columns`);
        return;
      }
      const [metalName, width, rawCost, markup] = row;
      if (!metalName || !metalNames.includes(metalName)) {
        alert(`Import failed on row ${i+1}.  Metal ${metalName} not found.`);
        return;
      }
      if (!width || isNaN(width)) {
        alert(`Import failed on row ${i+1}.  Need a numeric width.`);
        return;
      }
      if (isNaN(rawCost)) {
        alert(`Import failed on row ${i+1}.  Need a numeric raw cost.`);
        return;
      }
      if (isNaN(markup)) {
        alert(`Import failed on row ${i+1}.  Need a numeric markup.`);
        return;
      }
      const materialModel = new MaterialModel({
        metals: metals,
        metalName: metalName,
        shapeName: Shapes[0].name,
        width: width,
        innerWidth: "0",
        rawCost: rawCost,
        markup: markup,
      });
      saveMaterial({
        name: materialModel.autoName,
        isNameManual: false,
        metalName: metalName,
        shapeName: Shapes[0].name,
        width: Number(width),
        rawCost: Number(rawCost),
        markup: Number(markup),
      });
    });
  }

  function handleLoadMaterial(index) {
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
      <td style={{textAlign: "right"}}>{m.width.toFixed(1)}</td>
      <td style={{textAlign: "right"}}>{m.innerWidth ? m.innerWidth.toFixed(1) : "---"}</td>
      <td style={{textAlign: "right"}}>{materialsModels[i].weightPerMm.toFixed(4)}</td>
      <td style={{textAlign: "right"}}>{m.rawCost.toFixed(4)}</td>
      <td style={{textAlign: "right"}}>{m.markup}</td>
      <td style={{textAlign: "right"}}>{materialsModels[i].effectiveCost.toFixed(4)}</td>
      <td><button type="button" onClick={() => handleLoadMaterial(i)}>Load</button></td>
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

  const allMaterialsFrag = (
    <Table bordered striped>
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
          <th>Load</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  );

  const currentMaterialFrag = (<>
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

    <button type="submit" onClick={handleSaveMaterial}>
      Save Material
    </button>
  </>);

  const importerInstructionsText = `This importer only supports cylindrical shaped
materials.  Manual material names are not supported.
Paste 4 columns with no header:
  Column 1: metal name
  Column 2: diameter
  Column 3: raw cost
  Column 4: markup %

    -----------------------------|
    | C3604B | 1.8 | 291  | 6.5  |
    | GS5A-B | 5.0 | 317  | 6.5  |
    | 1215MS | 2.0 | 77.5 | 35   |
    | ...    |
  `;

  const administrationFrag = (<>
    <Importer 
      instructionsText={importerInstructionsText}
      buttonText="Save Materials"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (
    <Trifold
      top={allMaterialsFrag}
      middle={currentMaterialFrag}
      bottom={administrationFrag}
      singular="Material"
      plural="Materials"
    />
  );
}

export default Materials;
