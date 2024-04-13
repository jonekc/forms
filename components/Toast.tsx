import { Dispatch, SetStateAction } from 'react';

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
      <button
        type="button"
        className="btn btn-sm btn-circle btn-ghost"
        onClick={() => {
          setIsVisible(false);
        }}
      >
        ✕
      </button>
    </div>
  </div>
);

export { Toast };
export type { ToastType };
