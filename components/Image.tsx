import NextImage from 'next/image';
import { MouseEventHandler, useState } from 'react';
import { Loader } from './Loader';

type ImageProps = {
  src: string;
  alt?: string;
  className?: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Image = ({ src, alt, className, width, height, onClick }: ImageProps) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <button
      className={`flex justify-center items-center relative m-auto${isLoading ? ' min-h-[60vh]' : ''}`}
      onClick={onClick}
      {...(!onClick && { tabIndex: -1 })}
      {...(width && { style: { width } })}
    >
      {isLoading && (
        <div className="absolute">
          <Loader />
        </div>
      )}
      <NextImage
        src={src}
        alt={alt || ''}
        width={width || 0}
        height={height || 0}
        className={`${isLoading ? 'invisible' : ''}${className ? ` ${className}` : ''}`}
        onLoad={() => {
          setLoading(false);
        }}
        onError={() => {
          setLoading(false);
        }}
        {...((!width || !height) && { sizes: '100vw' })}
      />
    </button>
  );
};

export { Image };
