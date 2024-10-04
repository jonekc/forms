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
}: TextareaProps) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="textarea textarea-sm textarea-bordered"
    data-testid={id}
  />
);

export { Textarea };
