import Table from 'react-bootstrap/Table';

export class ItemOutsourcingsModel {
  constructor(outsourcings, itemOutsourcings, unitQuantity) {
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
      <h4>Outsourcing:</h4>
      <p>Quantity: {exampleUnitQuantity || 0} &rarr; Cost per unit: {ioModel.totalCostPerUnit.toFixed(2)}</p>
      <p>Starting grams per unit: {startingGramsPerUnit.toFixed(4)}</p>
      <Table bordered striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Grams per Unit</th>
            <th>Minimum Cost<br/>per kg</th>
            <th>Minimum Cost<br/>per unit</th>
            <th>Minimum Cost<br/>per job</th>
            <th>Cost cutover<br/>unit quantity</th>
            <th>Cost per unit</th>
            <th>Cost per {exampleUnitQuantity || 0}<br/>unit job</th>
            <th>Delete</th>
            <th>Add</th>
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
