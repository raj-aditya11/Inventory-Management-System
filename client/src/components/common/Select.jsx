function Select({
  label,
  placeholder,
  value,
  onChange,
  name,
  options = [],
  required = false,
  disabled = false,
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
        disabled={disabled}
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
          disabled:bg-gray-100
          disabled:text-gray-500
          disabled:cursor-not-allowed
        "
      >
        <option value="">
          {placeholder || `Select ${label}`}
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