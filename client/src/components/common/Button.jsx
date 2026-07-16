function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  icon: Icon,
  onClick,
  disabled = false,
  className = "",
}) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        font-medium
        transition-all
        duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105 active:scale-95"
        }
        ${className}
      `}
    >
      {Icon && <Icon size={18} />}

      {children}
    </button>
  );
}

export default Button;