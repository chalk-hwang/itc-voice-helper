// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import './Input.scss';

type Props = {
  label: string,
  type?: string,
  className?: string,
};

class Input extends Component<Props> {
  static defaultProps = {
    type: 'text',
    className: null,
  };

  // onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {};

  render() {
    const { label, type, className } = this.props;
    const processedClassName = cx('Input', className);
    return (
      <div className={processedClassName}>
        <input
          type={type}
          className="inp"
          aria-label={label}
          placeholder={label}
        />
        {type === 'password' && (
          <button
            type="button"
            className="btn-show-password"
            onClick={this.onShowPassword}
          >
            <i className="ti-eye" />
          </button>
        )}
      </div>
    );
  }
}

export default Input;
