import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesInitialRange } from "./LookupRanges"

export class ItemOverheadModel extends LookupRangesModel {
}

export function ItemOverheadInitialRange() {
  return LookupRangesInitialRange();
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
