// @flow
import React, { type Node } from 'react';
import classNames from 'classnames';
import styles from './Button.scss';

const cx = classNames.bind(styles);

type Props = {
  theme?: void | 'default',
  confirm?: boolean,
  cancel?: boolean,
  iconClass?: ?string,
  children: Node,
  color?: string,
  className?: string,
  fullWidth?: boolean,
};

const Button = ({
  theme,
  iconClass,
  color,
  className,
  fullWidth,
  cancel,
  confirm,
  children,
  ...rest
}: Props) => {
  const processedClassName = cx('Button', theme, className, color, {
    confirm,
    cancel,
    fullWidth,
  });
  return (
    <button className={processedClassName} type="button" {...rest}>
      {iconClass && <i className={iconClass} />}
      <span className="text">{children}</span>
    </button>
  );
};

Button.defaultProps = {
  theme: 'default',
  confirm: false,
  cancel: false,
  iconClass: null,
  color: '',
  className: '',
  fullWidth: false,
};

export default Button;
