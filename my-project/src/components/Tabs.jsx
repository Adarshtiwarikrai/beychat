
import { useState, createContext, useContext } from "react"

const TabsContext = createContext(null)

export function Tabs({ defaultValue, className, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }) {
  return <div className={`flex ${className}`}>{children}</div>
}

export function TabsTrigger({ value, className, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"} ${className}`}
      onClick={() => setActiveTab(value)}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children }) {
  const { activeTab } = useContext(TabsContext)

  if (activeTab !== value) return null

  return <div className={className}>{children}</div>
}
