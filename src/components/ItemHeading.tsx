interface ItemHeadingProps {
	title: string;
	subtitle: string;
}

export const ItemHeading = (props: ItemHeadingProps): JSX.Element => {
	return (
		<div>
			<h2 className="is-size-4">{props.title}</h2>
			<h3 className="is-size-6 has-text-grey is-italic">{props.subtitle}</h3>
		</div>
	);
};
