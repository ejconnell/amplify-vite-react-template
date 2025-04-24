import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesStartingRange } from "./LookupRanges"

export class ItemOverheadModel extends LookupRangesModel {
}

export function ItemOverheadStartingRange() {
  return LookupRangesStartingRange();
}

function ItemOverhead({itemOverheadRanges, exampleUnitQuantity, setItemOverheadRanges}) {

  return (
    <LookupRanges
       ranges={itemOverheadRanges}
       quantity={exampleUnitQuantity}
       setRanges={setItemOverheadRanges}
       title="Overhead"
       valueLabel="Overhead %"
    />
  );
}

export default ItemOverhead;
