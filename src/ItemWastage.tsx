import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesInitialRange } from "./LookupRanges"
import L10n from './L10n'
import { IItemWastageRange } from "./Types";

export class ItemWastageModel extends LookupRangesModel {
}

export function ItemWastageInitialRange(): IItemWastageRange{
  return LookupRangesInitialRange();
}

function ItemWastage({itemWastageRanges, exampleUnitQuantity, setItemWastageRanges}:{itemWastageRanges: IItemWastageRange[], exampleUnitQuantity: string, setItemWastageRanges: (itemWastageRanges: IItemWastageRange[]) => void}) {
  return (
    <LookupRanges
       ranges={itemWastageRanges}
       quantity={exampleUnitQuantity}
       setRanges={setItemWastageRanges}
       title={L10n.wastage.chinese + " Wastage"}
       valueLabel={L10n.wastage.chinese + " Wastage %"}
    />
  );
}

export default ItemWastage;
