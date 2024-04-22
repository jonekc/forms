import { forwardRef } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CloseButton } from './CloseButton';

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
        <h3 className="font-bold text-lg mr-3">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handlePrev}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <div className="w-full relative pt-[56.25%]">
            {src && (
              <Image src={src} alt="" fill style={{ objectFit: 'contain' }} />
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
