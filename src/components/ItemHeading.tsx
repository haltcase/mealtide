import React from "react";

interface ItemHeadingProps {
  title: string;
  subtitle: string;
}

export const ItemHeading: React.FunctionComponent<ItemHeadingProps> = props => {
  return (
    <div>
      <h2 className="is-size-4">{props.title}</h2>
      <h3 className="is-size-6 has-text-grey is-italic">{props.subtitle}</h3>
    </div>
  );
};
