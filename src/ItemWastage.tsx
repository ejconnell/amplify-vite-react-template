import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesInitialRange } from "./LookupRanges"
import Labels from './Labels'

export class ItemWastageModel extends LookupRangesModel {
}

export function ItemWastageInitialRange(): IItemWastageRange{
  return LookupRangesInitialRange();
}

function ItemWastage({itemWastageRanges, exampleUnitQuantity, setItemWastageRanges}) {
  return (
    <LookupRanges
       ranges={itemWastageRanges}
       quantity={exampleUnitQuantity}
       setRanges={setItemWastageRanges}
       title={Labels.wastage.chinese + " Wastage"}
       valueLabel={Labels.wastage.chinese + " Wastage %"}
    />
  );
}

export default ItemWastage;
