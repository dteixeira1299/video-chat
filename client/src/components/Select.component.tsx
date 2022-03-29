import React, { ChangeEvent, Component } from "react";
import styles from "../styles/Select.module.css";

interface SelectComponentProps {
  label?: string;
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
      <div>
        <label>
          <strong>{this.props.label}</strong>
        </label>
        <div>
          <select
            className={styles["select"]}
            value={this.props.value}
            onChange={this.props.onChange}
          >
            {this.props.options.map(option => {
              return (
                <option
                  className={styles["option"]}
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }
}
