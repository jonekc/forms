type LoaderProps = {
  size?: 'loading-xs' | 'loading-sm' | 'loading-md' | 'loading-lg';
};

const Loader = ({ size }: LoaderProps) => (
  <span className={`loading loading-spinner${size ? ` ${size}` : ''}`} />
);

export { Loader };
