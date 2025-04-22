import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesStartingRange } from "./LookupRanges"

export class ItemOverheadModel extends LookupRangesModel {
}

export function ItemOverheadStartingRange() {
  return LookupRangesStartingRange();
}

function ItemOverhead({itemOverheadRanges, exampleUnitQuantity, setItemOverheadRanges}) {

  //const iwModel = new ItemWastageModel(itemWastage);

  return (
    <LookupRanges
       ranges={itemOverheadRanges}
       quantity={exampleUnitQuantity}
       setRanges={setItemOverheadRanges}
       title="Overhead"
       valueLabel="Overhead percentage"
    />
  );
}

export default ItemOverhead;
