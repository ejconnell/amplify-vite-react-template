import LookupRanges from "./LookupRanges"
import { LookupRangesModel, LookupRangesInitialRange } from "./LookupRanges"
import Labels from './Labels'

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
       title={Labels.overhead.chinese + " Overhead"}
       valueLabel={Labels.overhead.chinese + "Overhead %"}
    />
  );
}

export default ItemOverhead;
