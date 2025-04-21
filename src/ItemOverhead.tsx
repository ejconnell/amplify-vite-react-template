import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesStartingRange } from "./LookupRanges"

export class ItemOverheadModel extends LookupRangesModel {
}

export function ItemOverheadStartingRange() {
  return LookupRangesStartingRange();
}

function ItemOverhead({itemOverheadRanges, exampleQuantity, setItemOverheadRanges}) {

  //const iwModel = new ItemWastageModel(itemWastage);

  return (
    <LookupRanges
       ranges={itemOverheadRanges}
       exampleQuantity={exampleQuantity}
       setRanges={setItemOverheadRanges}
       title="Overhead"
       valueLabel="Overhead percentage"
    />
  );
}

export default ItemOverhead;
