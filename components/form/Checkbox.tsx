type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
};

const Checkbox = ({ label, checked, onChange, id }: CheckboxProps) => (
  <label className="label cursor-pointer w-fit">
    <input
      type="checkbox"
      checked={checked}
      className="checkbox checkbox-sm checkbox-primary"
      onChange={onChange}
      data-testid={id}
    />
    <span className="label-text ml-2">{label}</span>
  </label>
);

export { Checkbox };
