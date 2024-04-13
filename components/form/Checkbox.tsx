type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => (
  <label className="label cursor-pointer w-fit">
    <input
      type="checkbox"
      checked={checked}
      className="checkbox checkbox-sm checkbox-primary"
      onChange={onChange}
    />
    <span className="label-text ml-2">{label}</span>
  </label>
);

export { Checkbox };
