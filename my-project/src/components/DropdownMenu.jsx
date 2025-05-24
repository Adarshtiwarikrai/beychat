export function DropdownMenu({ children }) {
  return <div className="relative">{children}</div>
}

export function DropdownMenuTrigger({ children, asChild }) {
  return <>{children}</>
}

export function DropdownMenuContent({ children, align = "center" }) {
  const alignClass = align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 transform -translate-x-1/2"

  return (
    <div
      className={`absolute top-full mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md ${alignClass}`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children }) {
  return (
    <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 w-full text-left">
      {children}
    </button>
  )
}
