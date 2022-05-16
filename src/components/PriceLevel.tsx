import type { DomNumber } from "../utilities";
import { toDoubleString } from "../utilities";

interface PriceLevelProps {
	price: DomNumber;
}

export const PriceLevel = (props: PriceLevelProps): JSX.Element => (
	<div className="level is-mobile">
		<div className="level-left">$</div>
		<div className="level-right">{toDoubleString(props.price)}</div>
	</div>
);
