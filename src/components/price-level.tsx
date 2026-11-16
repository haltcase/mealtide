import type { DomNumber } from "../models/types";
import { toDoubleString } from "../utilities/calc";

interface PriceLevelProps {
	price: DomNumber;
}

export const PriceLevel: React.FC<PriceLevelProps> = ({ price }) => (
	<div className="flex flex-row justify-between">
		<span>$</span>
		<span>{toDoubleString(price)}</span>
	</div>
);
