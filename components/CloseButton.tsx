import { MouseEventHandler } from 'react';

type CloseButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: MouseEventHandler;
};

const CloseButton = ({ type, className, onClick }: CloseButtonProps) => (
  <button
    type={type}
    className={`btn btn-sm btn-circle btn-ghost${className ? ` ${className}` : ''}`}
    onClick={onClick}
  >
    ✕
  </button>
);

export { CloseButton };
