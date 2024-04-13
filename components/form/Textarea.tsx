type TextareaProps = {
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const Textarea = ({ placeholder, value, onChange }: TextareaProps) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="textarea textarea-sm textarea-bordered"
  />
);

export { Textarea };
