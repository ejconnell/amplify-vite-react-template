import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesStartingRange } from "./LookupRanges"

export class ItemWastageModel extends LookupRangesModel {
}

export function ItemWastageStartingRange() {
  return LookupRangesStartingRange();
}

function ItemWastage({itemWastageRanges, exampleUnitQuantity, setItemWastageRanges}) {
  return (
    <LookupRanges
       ranges={itemWastageRanges}
       quantity={exampleUnitQuantity}
       setRanges={setItemWastageRanges}
       title="Wastage"
       valueLabel="Wastage %"
    />
  );
}

export default ItemWastage;
