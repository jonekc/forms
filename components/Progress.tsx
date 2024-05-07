import { CSSProperties } from 'react';

type ProgressProps = {
  uploadProgress: number;
};

const Progress = ({ uploadProgress }: ProgressProps) => (
  <div
    className="radial-progress mt-2 text-primary"
    style={
      {
        '--value': uploadProgress,
        '--size': '3rem',
      } as CSSProperties
    }
    role="progressbar"
  >
    {uploadProgress}%
  </div>
);

export { Progress };
