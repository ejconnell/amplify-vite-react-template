import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesInitialRange } from "./LookupRanges"

export class ItemWastageModel extends LookupRangesModel {
}

export function ItemWastageInitialRange() {
  return LookupRangesInitialRange();
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
