import React, { ChangeEvent, Component } from "react";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

interface SelectComponentProps {
  label?: string;
  value: any;
  options: SelectOption[];
  className?: any;
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
      <div className={this.props.className}>
        <label>
          <strong>{this.props.label}</strong>
        </label>
        <div>
          <Form.Select value={this.props.value} onChange={this.props.onChange}>
            {this.props.options.map(option => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </Form.Select>
        </div>
      </div>
    );
  }
}
