import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import Labels from './Labels';
import { MaterialModel } from "./MaterialModel";
import { Shapes } from "./Shapes";
import { IMaterial, IMetal } from "./types";

export function blankMaterial(): IMaterial {
  return {
    name: "",
    isNameManual: false,
    metalName: "",
    shapeName: "",
    width: 0,
    innerWidth: 0,
    rawCost: 0,
    markup: 0,
  };
}

function Materials({materials, metals, saveMaterial}: {materials: IMaterial[], metals: IMetal[], saveMaterial: (material: IMaterial) => void}) {
  const [isNameManual, setIsNameManual] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [metalName, setMetalName] = useState<string>("");
  const [shapeName, setShapeName] = useState<string>(Shapes[0].name);
  const [width, setWidth] = useState<string>("");
  const [innerWidth, setInnerWidth] = useState<string>("");
  const [rawCost, setRawCost] = useState<string>("");
  const [markup, setMarkup] = useState<string>("6.5");

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
    if (!width || isNaN(Number(width))) {
      alert("Need a numeric Width");
      return;
    }
    if (!rawCost || isNaN(Number(rawCost))) {
      alert("Need a numeric Raw Cost");
      return;
    }
    if (!markup || isNaN(Number(markup))) {
      alert("Need a numeric Markup");
      return;
    }
    if (materialModel.hasInnerWidth && (!innerWidth || isNaN(Number(innerWidth)))) {
      alert("Need a numeric Inner Width");
      return;
    }

    const material: IMaterial = {
      name: mergedName,
      isNameManual: isNameManual,
      metalName: metalName,
      shapeName: shapeName,
      width: Number(width),
      innerWidth: materialModel.hasInnerWidth ? Number(innerWidth) : 0,
      rawCost: Number(rawCost),
      markup: Number(markup),
    };
    saveMaterial(material);
  };

  function importerProcessorFunc(grid: string[][]) {
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
      if (!width || isNaN(Number(width))) {
        alert(`Import failed on row ${i+1}.  Need a numeric width.`);
        return;
      }
      if (isNaN(Number(rawCost))) {
        alert(`Import failed on row ${i+1}.  Need a numeric raw cost.`);
        return;
      }
      if (isNaN(Number(markup))) {
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
        innerWidth: 0,
        rawCost: Number(rawCost),
        markup: Number(markup),
      });
    });
  }

  function handleLoadMaterial(index: number) {
     const material = materials[index];
     setName(material.name);
     setIsNameManual(material.isNameManual);
     setMetalName(material.metalName);
     setShapeName(material.shapeName);
     setWidth(String(material.width));
     setInnerWidth(String(material.innerWidth));
     setRawCost(String(material.rawCost));
     setMarkup(String(material.markup));
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
    <label>{Labels.inner.chinese}{materialModel.chineseWidth} Inner {materialModel.widthLabel} (mm):</label>
    <input
      value={innerWidth}
      onChange={(e) => setInnerWidth(e.target.value)}
    />
   </>);

  const metalSelectOptions = metals.map(m => {
     return <option value={m.name} key={m.name}>{m.name}</option>;
  });

  const shapeSelectOptions = Shapes.map(s => {
     return <option value={s.name} key={s.name}>{s.chinese} {s.name}</option>;
  });

  const allMaterialsFrag = (
    <Table bordered striped>
      <thead>
        <tr>
          <th>{Labels.wastage.chinese} Name</th>
          <th>{Labels.metal.chinese} Metal</th>
          <th>{Labels.shape.chinese} Shape</th>
          <th>{Labels.width.chinese} Width (mm)</th>
          <th>{Labels.innerWidth.chinese} Inner Width (mm)</th>
          <th>{Labels.gramsPerMm.chinese}<br/>Weight per mm (g/mm)</th>
          <th>{Labels.pricePerKgManufacturer.chinese}<br/>Raw Cost ($/kg)</th>
          <th>{Labels.surchargePercentage.chinese} Markup %</th>
          <th>{Labels.pricePerKgSurcharge.chinese}<br/>Effective Cost ($/kg)</th>
          <th>{Labels.load.chinese} Load</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  );

  const currentMaterialFrag = (<>
    <label>{Labels.name.chinese} Name:</label>
    <input
      value={mergedName}
      onChange={(e) => setName(e.target.value)}
      disabled={!isNameManual}
    />
    &nbsp;
    <label>{Labels.useManualName.chinese} Use Manual Name:</label>
    <input
      type="checkbox"
      name="isNameManual"
      checked={isNameManual}
      onChange={() => setIsNameManual(!isNameManual) }
    />
    <br/>

    <label>{Labels.metal.chinese} Metal:</label>
    <select
      value={metalName}
      onChange={e => setMetalName(e.target.value)}
    >
      <option value="" key=""></option>;
      {metalSelectOptions}
    </select>
    &nbsp;
    <label>{Labels.density.chinese} Density: {materialModel.density || "-"} g/mm<sup>3</sup></label>
    <br/>

    <label>{Labels.shape.chinese} Shape:</label>
    <select
      value={shapeName}
      onChange={e => setShapeName(e.target.value)}
    >
      {shapeSelectOptions}
    </select>
    <br/>

    <label>{materialModel.chineseWidth} {materialModel.widthLabel} (mm):</label>
    <input
      value={width}
      onChange={(e) => setWidth(e.target.value)}
    />
    {materialModel.hasInnerWidth && innerWidthFragment}
    &nbsp; &nbsp;
    <label>{Labels.crossSectionArea.chinese} Cross section area (mm<sup>2</sup>): {materialModel.crossSectionArea.toFixed(4)}</label>
    &nbsp; &nbsp;
    <label>{Labels.gramsPerMm.chinese} Weight per mm (g/mm): {materialModel.weightPerMm.toFixed(4)}</label>
    <br/>

    <label>{Labels.pricePerKgManufacturer.chinese} Raw Cost:</label>
    <input
      value={rawCost}
      onChange={(e) => setRawCost(e.target.value)}
    />
    <label>{Labels.surchargePercentage.chinese} Markup %:</label>
    <input
      value={markup}
      onChange={(e) => setMarkup(e.target.value)}
    />
    <label>{Labels.pricePerKgSurcharge.chinese} Effective Cost: {materialModel.effectiveCost}</label>
    <br/>

    <button type="submit" onClick={handleSaveMaterial}>
      {Labels.save.chinese}{Labels.material.chinese} Save Material
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
      label={Labels.material}
    />
  );
}

export default Materials;
