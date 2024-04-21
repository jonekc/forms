import { Dispatch, SetStateAction } from 'react';
import { CloseButton } from './CloseButton';

type ToastType =
  | 'alert-success'
  | 'alert-error'
  | 'alert-info'
  | 'alert-warning';

type ToastProps = {
  message: string;
  type?: ToastType;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
};

const Toast = ({
  message,
  type = 'alert-success',
  setIsVisible,
}: ToastProps) => (
  <div className="toast">
    <div className={`alert ${type} p-3`}>
      <span>{message}</span>
      <CloseButton
        type="button"
        onClick={() => {
          setIsVisible(false);
        }}
      />
    </div>
  </div>
);

export { Toast };
export type { ToastType };
