import { Image } from '@prisma/client';
import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';

type EditImageProps = {
  id: string;
  setExistingImages: Dispatch<
    SetStateAction<
      (Image & {
        file: '' | File;
        title: string;
      })[]
    >
  >;
};

const EditImage = ({ id, setExistingImages }: EditImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExistingImages((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: file.name,
                url: URL.createObjectURL(file),
                file,
              }
            : item,
        ),
      );
    }
  };

  return (
    <>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        Edit
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export { EditImage };
