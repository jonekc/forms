type LoaderSize = 'loading-xs' | 'loading-sm' | 'loading-md' | 'loading-lg';

type LoaderProps = {
  size?: LoaderSize;
};

const Loader = ({ size }: LoaderProps) => (
  <span className={`loading loading-spinner${size ? ` ${size}` : ''}`} />
);

export { Loader };
export type { LoaderSize };
