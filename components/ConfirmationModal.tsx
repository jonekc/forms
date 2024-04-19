import { forwardRef } from 'react';
import { Loader } from './Loader';

type ConfirmationModalProps = {
  onConfirm: () => void;
  title: string;
  message: string;
  buttonLoading?: boolean;
};

const ConfirmationModal = forwardRef<HTMLDialogElement, ConfirmationModalProps>(
  ({ title, message, onConfirm, buttonLoading }, ref) => (
    <dialog className="modal" ref={ref}>
      <div className="modal-box max-w-xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mr-3">{title}</h3>
        <p className="pt-4">{message}</p>
        <div className="modal-action">
          <button
            className="btn btn-sm btn-primary"
            onClick={onConfirm}
            disabled={buttonLoading}
          >
            {buttonLoading && <Loader />}
            Confirm
          </button>
          <form method="dialog">
            <button className="btn btn-sm btn-ghost">Cancel</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  ),
);

export { ConfirmationModal };
