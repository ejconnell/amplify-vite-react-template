import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesStartingRange } from "./LookupRanges"

export class ItemWastageModel extends LookupRangesModel {
}

export function ItemWastageStartingRange() {
  return LookupRangesStartingRange();
}

function ItemWastage({itemWastageRanges, exampleQuantity, setItemWastageRanges}) {

  //const iwModel = new ItemWastageModel(itemWastage);

  return (
    <LookupRanges
       ranges={itemWastageRanges}
       exampleQuantity={exampleQuantity}
       setRanges={setItemWastageRanges}
       title="Wastage"
       valueLabel="Wastage percentage"
    />
  );
}

export default ItemWastage;
