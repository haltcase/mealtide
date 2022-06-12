interface ItemHeadingProps {
	title: string;
	subtitle: string;
}

export const ItemHeading = (props: ItemHeadingProps): JSX.Element => {
	return (
		<h2>
			<span className="is-size-4">{props.title}</span>
			<span> </span>
			<span className="is-size-6 has-text-grey is-italic nowrap">
				{props.subtitle}
			</span>
		</h2>
	);
};
