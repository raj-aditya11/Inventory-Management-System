function Textarea({
  label,
  placeholder,
  value,
  onChange,
  name,
  rows = 4,
  disabled = false,
  required = false,
  error,
  className = "",
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`
          w-full
          px-4
          py-2
          border
          border-gray-300
          rounded-lg
          outline-none
          resize-none
          transition
          duration-200
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          disabled:bg-gray-100
          ${className}
        `}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default Textarea;