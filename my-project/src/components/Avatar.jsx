export function Avatar({ className, children }) {
  return (
    <div className={`inline-flex items-center justify-center overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  )
}
