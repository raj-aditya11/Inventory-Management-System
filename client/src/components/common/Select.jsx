function Select({
  label,
  value,
  onChange,
  name,
  options = [],
  required = false,
}) {
  return (
    <div className="flex flex-col gap-2">

      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full
          px-4
          py-2
          border
          border-gray-300
          rounded-lg
          focus:ring-2
          focus:ring-blue-500
          outline-none
        "
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  );
}

export default Select;