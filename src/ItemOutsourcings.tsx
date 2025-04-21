import { OutsourcingModel } from "./Outsourcings";

export class ItemOutsourcingsModel {
  constructor({outsourcings, itemOutsourcings}) {
    this.rows = itemOutsourcings.map(io => {
      const outsourcing = outsourcings.find(o => o.name === io.name);
      if (!outsourcing) { return {}; }
      const outsourcingModel = new OutsourcingModel(outsourcing)

      return {
        isPricedByUnit: outsourcing.isPricedByUnit,
 
      }

    });
  }
}

function ItemOutsourcings({outsourcings, itemOutsourcings, exampleQuantity, setItemOutsourcings}) {

  //const iwModel = new ItemWastageModel(itemWastage);

  function addItemOutsourcing(index) {
    const nextItemOutsourcings = [
      ...itemOutsourcings.slice(0, index+1),
      {
        key: crypto.randomUUID(),
        name: "",
        gramsPerUnit: 0,
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
    console.log(`handleNameChange ${value} ${index}`);
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
    console.log(`handleNameChange  ${JSON.stringify(nextItemOutsourcings)}`);
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
    <td><button type="button" onClick={() => addItemOutsourcing(-1)}> + </button></td>
  </tr>;

  const outsourcingsSelectOptions = outsourcings.map(os => 
    <option value={os.name} key={os.name}>{os.name}</option>
  );

  const itemOutsourcingsRowsFrag = itemOutsourcings.map((io, i) => {
    const outsourcing = outsourcings.find(o => o.name === io.name);

    const nameSelectFrag = <select
      value={io.name}
      onChange={e => handleNameChange(e.target.value, i)}
    >
      <option value=""></option>
      {outsourcingsSelectOptions}
    </select>

    const gramsPerUnitInputFrag = outsourcing?.isPricedByUnit ? "-" : <input
      value={io.gramsPerUnit}
      onChange={e => handleGramsPerUnitChange(e.target.value, i)}
    />

    return <tr key={io.key}>
      <td>{nameSelectFrag}</td>
      <td>{gramsPerUnitInputFrag}</td>
      <td></td>
      <td></td>
      <td><button type="button" onClick={() => deleteItemOutsourcing(i)}> - </button></td>
      <td><button type="button" onClick={() => addItemOutsourcing(i)}> + </button></td>
    </tr>
  });

  const itemOutsourcingsTotalRowFrag = "";

  return (
    <>
      <h3>Outsourcing:</h3>
      <table border="1px solid black">
        <thead>
          <tr>
            <th>Name</th>
            <th>Grams per Unit</th>
            <th>Cost Per 1k</th>
            <th>Cost Per Unit</th>
            <th>Delete</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {itemOutsourcings.length === 0 ? itemOutsourcingsEmptyRowFrag : itemOutsourcingsRowsFrag}
          {itemOutsourcingsTotalRowFrag}
        </tbody>
      </table>
    </>
  );
}

export default ItemOutsourcings;
