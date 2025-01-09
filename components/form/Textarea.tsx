import React, { useEffect, useRef } from 'react';

type TextareaProps = {
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  id?: string;
};

const Textarea = ({
  placeholder,
  value,
  onChange,
  required,
  id,
}: TextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="textarea textarea-sm textarea-bordered"
      data-testid={id}
    />
  );
};

export { Textarea };
