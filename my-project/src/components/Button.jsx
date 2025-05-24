export function Button({ children, className, variant = "default", size = "default", ...props }) {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
      case "ghost":
        return "hover:bg-gray-100 text-gray-700"
      default:
        return "bg-gray-900 text-white hover:bg-gray-800"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1"
      case "icon":
        return "h-9 w-9 p-2"
      default:
        return "text-sm px-4 py-2"
    }
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
