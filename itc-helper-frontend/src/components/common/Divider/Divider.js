// @flow
import React from 'react';
import classNames from 'classnames';
import styles from './Divider.scss';

const cx = classNames.bind(styles);

type Props = {
  text?: string,
};

const Divider = ({ text }: Props) => {
  const proccessedClassName = cx('Divider', {
    textEmpty: text === '',
  });
  return (
    <div className={proccessedClassName}>
      <span className="divider-content">
        {text !== '' && <span className="text">{text}</span>}
      </span>
    </div>
  );
};

Divider.defaultProps = {
  text: '',
};

export default Divider;
