import { ChangeEvent, Component } from "react";

interface SelectComponentProps {
  value: any;
  options: SelectOption[];
  onChange(event: ChangeEvent<HTMLSelectElement>): any;
}

export interface SelectOption {
  value: any;
  label: string;
}

export class SelectComponent extends Component<SelectComponentProps> {
  constructor(props: SelectComponentProps) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <select value={this.props.value} onChange={this.props.onChange}>
        {this.props.options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    );
  }
}
