import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesInitialRange } from "./LookupRanges"
import L10n from './L10n'
import { IItemOverheadRange } from "./Types";

export class ItemOverheadModel extends LookupRangesModel {
}

export function ItemOverheadInitialRange(): IItemOverheadRange {
  return LookupRangesInitialRange();
}

function ItemOverhead({itemOverheadRanges, exampleUnitQuantity, setItemOverheadRanges}:{itemOverheadRanges: IItemOverheadRange[], exampleUnitQuantity: string, setItemOverheadRanges: (itemOverheadRanges: IItemOverheadRange[]) => void}) {
  return (
    <LookupRanges
       ranges={itemOverheadRanges}
       quantity={exampleUnitQuantity}
       setRanges={setItemOverheadRanges}
       title={L10n.overhead.chinese + " Overhead"}
       valueLabel={L10n.overhead.chinese + "Overhead %"}
    />
  );
}

export default ItemOverhead;
