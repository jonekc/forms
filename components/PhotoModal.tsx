import { forwardRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CloseButton } from './CloseButton';
import { Image } from './Image';

type PhotoModalProps = {
  title: string;
  src: string;
  handlePrev: () => void;
  handleNext: () => void;
};

const PhotoModal = forwardRef<HTMLDialogElement, PhotoModalProps>(
  ({ title, src, handlePrev, handleNext }, ref) => (
    <dialog className="modal" ref={ref}>
      <div className="modal-box max-w-6xl">
        <form method="dialog">
          <CloseButton className="absolute right-2 top-2" />
        </form>
        <div className="flex items-center gap-2 mr-3 mb-2">
          <h3 className="font-bold text-lg m-0">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handlePrev}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <div className="d-flex justify-center w-full">
            {src && (
              <Image
                src={src}
                alt={title}
                className="w-full h-auto max-h-[70vh]"
              />
            )}
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleNext}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  ),
);

export { PhotoModal };
