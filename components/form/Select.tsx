type SelectProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
};

const Select = ({ value, onChange, options }: SelectProps) => (
  <select
    value={value}
    onChange={onChange}
    className="select select-sm select-bordered"
  >
    {options.map((option) => (
      <option key={option.label} value={option.label}>
        {option.value}
      </option>
    ))}
  </select>
);

export { Select };
