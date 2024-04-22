type InputProps = {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
}: InputProps) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="input input-sm input-bordered"
  />
);

export { Input };
