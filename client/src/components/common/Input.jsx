function Input({
  label,
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  required = false,
  className = "",
  icon: Icon,
  error,
}) {
  return (
    <div className="flex flex-col gap-2 w-full">

      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        )}

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full
            ${Icon ? "pl-10" : "pl-4"}
            pr-4
            py-2
            border
            border-gray-300
            rounded-lg
            outline-none
            transition
            duration-200
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            disabled:bg-gray-100
            ${className}
          `}
        />
      </div>

      {error && (
            <p className="text-red-500 text-sm">
                {error}
            </p>
        )}
        
    </div>
  );
}

export default Input;