import Table from 'react-bootstrap/Table';
import Labels from './Labels';

export class ItemOutsourcingsModel {
  totalCostPerUnit: number;
  totalCostPerJob: number;
  rows: IItemOutsourcingModelRow[];
  constructor(outsourcings: IOutsourcing[], itemOutsourcings: IItemOutsourcing[], unitQuantity: number) {
    this.totalCostPerUnit = 0;
    this.totalCostPerJob = 0;
    this.rows = itemOutsourcings.map(io => {
      const outsourcing = outsourcings.find(o => o.name === io.name);

      let minCostPerUnit;
      let minCostPerKilogram;
      let costCutoverUnitQuantity;
      if (outsourcing?.isPricedByUnit) {
        minCostPerUnit = outsourcing?.variableCost;
        costCutoverUnitQuantity = outsourcing?.minCostPerJob / minCostPerUnit;
      } else {
        minCostPerKilogram = outsourcing?.variableCost;
        minCostPerUnit = minCostPerKilogram / 1000 * io.gramsPerUnit;
        costCutoverUnitQuantity = outsourcing?.minCostPerJob / minCostPerUnit;
      }

      let costPerUnit;
      let costPerJob;
      if (unitQuantity > costCutoverUnitQuantity) {
        costPerUnit = minCostPerUnit;
        costPerJob = costPerUnit * unitQuantity;
      } else {
        costPerJob = outsourcing?.minCostPerJob;
        costPerUnit = outsourcing?.minCostPerJob / unitQuantity;
      }
      if (!minCostPerUnit) {
        costPerJob = Number.NaN;
        costPerUnit = Number.NaN;
      }

      this.totalCostPerUnit += costPerUnit;
      this.totalCostPerJob += costPerJob;

      return {
        minCostPerUnit: minCostPerUnit || Number.NaN,
        minCostPerKilogram: minCostPerKilogram || Number.NaN,
        costCutoverUnitQuantity: costCutoverUnitQuantity || Number.NaN,
        costPerUnit: costPerUnit || Number.NaN,
        costPerJob: costPerJob || Number.NaN,
      }
    });
  }
}

function ItemOutsourcings({outsourcings, itemOutsourcings, exampleUnitQuantity, startingGramsPerUnit, setItemOutsourcings}) {

  const ioModel = new ItemOutsourcingsModel(outsourcings, itemOutsourcings, exampleUnitQuantity);

  function addItemOutsourcing(index) {
    const nextItemOutsourcings = [
      ...itemOutsourcings.slice(0, index+1),
      {
        key: crypto.randomUUID(),
        name: "",
        gramsPerUnit: "",
      },
      ...itemOutsourcings.slice(index+1),
    ];
    setItemOutsourcings(nextItemOutsourcings);
  }

  function deleteItemOutsourcing(index) {
    const nextItemOutsourcings = [
      ...itemOutsourcings.slice(0, index),
      ...itemOutsourcings.slice(index+1),
    ];
    setItemOutsourcings(nextItemOutsourcings);
  }

  function handleNameChange(value, index) {
    const nextItemOutsourcings = itemOutsourcings.map((io, i) => {
      if (i === index) {
        return {
          key: io.key,
          name: value,
          gramsPerUnit: io.gramsPerUnit,
        }
      } else {
        return {...io};
      };
    });
    setItemOutsourcings(nextItemOutsourcings);
  }

  function handleGramsPerUnitChange(value, index) {
    const nextItemOutsourcings = itemOutsourcings.map((io, i) => {
      if (i === index) {
        return {
          key: io.key,
          name: io.name,
          gramsPerUnit: value,
        }
      } else {
        return {...io};
      };
    });
    setItemOutsourcings(nextItemOutsourcings);
  }

  const itemOutsourcingsEmptyRowFrag = <tr key="empty row">
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td><button type="button" onClick={() => addItemOutsourcing(-1)}> + </button></td>
  </tr>;

  const outsourcingsSelectOptions = outsourcings.map(os =>
    <option value={os.name} key={os.name}>{os.name}</option>
  );

  const itemOutsourcingsRowsFrag = itemOutsourcings.map((io, i) => {
    const outsourcing = outsourcings.find(o => o.name === io.name);
    const modelRow = ioModel.rows[i];

    const nameSelectFrag = <select
      value={io.name}
      onChange={e => handleNameChange(e.target.value, i)}
    >
      <option value=""></option>
      {outsourcingsSelectOptions}
    </select>

    const gramsPerUnitInputFrag = outsourcing?.isPricedByUnit ? "---" : <input
      value={io.gramsPerUnit}
      onChange={e => handleGramsPerUnitChange(e.target.value, i)}
      style={{width: "90px"}}
    />

    return <tr key={io.key}>
      <td>{nameSelectFrag}</td>
      <td>{gramsPerUnitInputFrag}</td>
      <td>{modelRow.minCostPerKilogram ? modelRow.minCostPerKilogram.toFixed(2) : "--"}</td>
      <td>{modelRow.minCostPerUnit.toFixed(4)}</td>
      <td>{outsourcing?.minCostPerJob}</td>
      <td>{modelRow.costCutoverUnitQuantity.toFixed(1)}</td>
      <td>{modelRow.costPerUnit.toFixed(4)}</td>
      <td>{modelRow.costPerJob.toFixed(1)}</td>
      <td><button type="button" onClick={() => deleteItemOutsourcing(i)}> - </button></td>
      <td><button type="button" onClick={() => addItemOutsourcing(i)}> + </button></td>
    </tr>
  });

  const itemOutsourcingsTotalRowFrag = <tr key="total row">
    <td><b>Total</b></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td><b>{ioModel.totalCostPerUnit.toFixed(4)}</b></td>
    <td>{ioModel.totalCostPerJob.toFixed(1)}</td>
    <td></td>
    <td></td>
  </tr>;

  return (
    <>
      <h4>{Labels.outsourcing.chinese} Outsourcing:</h4>
      <p>{Labels.exampleUnitQuantity.chinese} Example unit quantity: {exampleUnitQuantity || 0} &rarr; {Labels.costPerUnit.chinese} Cost per unit: {ioModel.totalCostPerUnit.toFixed(2)}</p>
      <p>{Labels.starting.chinese}{Labels.gramsPerUnit.chinese} Starting grams per unit: {startingGramsPerUnit.toFixed(4)}</p>
      <Table bordered striped>
        <thead>
          <tr>
            <th>{Labels.name.chinese} Name</th>
            <th>{Labels.gramsPerUnit.chinese} Grams per Unit</th>
            <th>{Labels.minCostPerKg.chinese} Minimum Cost per kg</th>
            <th>{Labels.minCostPerUnit.chinese} Minimum Cost per unit</th>
            <th>{Labels.minCostPerJob.chinese} Minimum Cost per job</th>
            <th>{Labels.costcutoverUnitQuantity.chinese} Cost cutover unit quantity</th>
            <th>{Labels.costPerUnit.chinese} Cost per unit</th>
            <th>{Labels.cost.chinese} / {exampleUnitQuantity || 0} {Labels.unit.chinese} Cost per {exampleUnitQuantity || 0}<br/>unit job</th>
            <th>{Labels.remove.chinese} Delete</th>
            <th>{Labels.add.chinese} Add</th>
          </tr>
        </thead>
        <tbody>
          {itemOutsourcings.length === 0 ? itemOutsourcingsEmptyRowFrag : itemOutsourcingsRowsFrag}
          {itemOutsourcingsTotalRowFrag}
        </tbody>
      </Table>
    </>
  );
}

export default ItemOutsourcings;
