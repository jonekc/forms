import { ReactNode } from 'react';
import { Loader, LoaderSize } from './Loader';

type OverlayLoaderProps = {
  size?: LoaderSize;
  isLoading: boolean;
  children: ReactNode;
};

const OverlayLoader = ({
  size = 'loading-md',
  isLoading,
  children,
}: OverlayLoaderProps) => (
  <div className="relative">
    {children}
    {isLoading && (
      <>
        <div className="flex justify-center absolute top-0 left-0 right-0 bottom-0 bg-white opacity-40" />
        <div className="flex justify-center absolute top-0 left-0 right-0 bottom-0">
          <Loader size={size} />
        </div>
      </>
    )}
  </div>
);

export { OverlayLoader };
