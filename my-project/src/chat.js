
"use client"
import React, { useRef, useEffect, forwardRef, useState, useCallback } from "react"
import {
  MessageSquare,
  ChevronDown,
  Sun,
  MoreHorizontal,
  Zap,
  Star,
  Phone,
  SplitSquareHorizontal,
  Archive,
  ArrowLeft, 
} from "lucide-react"
import AddReactionIcon from "@mui/icons-material/AddReaction"

// --- Custom SVG Icons ---
const CustomBookmarkIcon = ({ size = 18, className = "", color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color} 
    stroke="none"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 21 L12 17 L5 21 V5 C5 3.8954305 5.8954305 3 7 3 H17 C18.1045695 3 19 3.8954305 19 5 V21 Z M5 9 L19 9 L19 7 L5 7 L5 9 Z"
    />
  </svg>
)

const NewCustomMoonWithZIcon = ({ size = 20, className = "" }) => (
  
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="black" stroke="none" />
    <text x="16" y="8" fontFamily="system-ui, -apple-system, sans-serif" fontSize="12" fontWeight="700" fill="black">
      z
    </text>
  </svg>
)

const CustomCloseBoxIcon = ({ size = 16, className = "", color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke={color} strokeWidth="1.5" />
    <line x1="4" y1="19" x2="20" y2="19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M8 10 L12 14 L16 10"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CustomChartIcon = ({ size = 20, className = "", color = "currentColor", theme }) => {
  const barBottomY = 40
  const barHeights = [12, 18, 12]
  const simpleDisplay = false
  const isAnimating = false
  const barFill = theme === 'dark' ? 'black' : 'white';
  const smileStroke = theme === 'dark' ? 'black' : 'white';

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="4" width="56" height="56" rx="12" fill={color} />
      {!simpleDisplay && (
        <>
          <rect x="20" y={barBottomY - barHeights[0]} width="4" height={barHeights[0]} rx="2" fill={barFill} />
          <rect x="30" y={barBottomY - barHeights[1]} width="4" height={barHeights[1]} rx="2" fill={barFill} />
          <rect x="40" y={barBottomY - barHeights[2]} width="4" height={barHeights[2]} rx="2" fill={barFill} />
          {!isAnimating && (
            <path d="M22 50 Q32 56 42 50" stroke={smileStroke} strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
        </>
      )}
    </svg>
  )
}

const BoldIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
)

const ItalicIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <line x1="19" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="2" />
    <line x1="14" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth="2" />
    <line x1="15" y1="4" x2="9" y2="20" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const CodeIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <polyline points="16,18 22,12 16,6" fill="none" stroke="currentColor" strokeWidth="2" />
    <polyline points="8,6 2,12 8,18" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const LinkIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M21 2l-6 6m0 0v4m0-4h4" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M3 3l6 6m0 0v4m0-4h4" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const H1Icon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M4 12h8m-8 6V6m8 12V6m5 6v6m0-6a2 2 0 0 1 2-2" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const H2Icon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M4 12h8m-8 6V6m8 12V6" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M15 13h4c0 1.5-2 2.5-4 3.5v1h4" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const ChartSubMenu = ({ x, y, selectedText, onAction, onClose, theme, disabled = false }) => {
  const menuRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }
    const handleEscapeKey = (event) => { if (event.key === "Escape") { onClose() } }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [onClose])
  
  const menuClasses = theme === "dark" ? "bg-black border-white/30 text-white" : "bg-white border-gray-300 text-gray-700";
  const buttonClasses = theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100";
  const tooltipClasses = theme === "dark" ? "bg-white text-black" : "bg-gray-900 text-white";


  const subMenuItems = [
    { label: "Rephrase", action: "rephrase", tooltip: "Rephrase selected text" },
    { label: "My tone of voice", action: "tone_of_voice", tooltip: "Adjust tone of voice (e.g. professional)" },
    { label: "More friendly", action: "more_friendly", tooltip: "Make text more friendly" },
    { label: "More formal", action: "more_formal", tooltip: "Make text more formal" },
    { label: "Fix grammar & spelling", action: "fix_grammar", tooltip: "Correct grammar and spelling" },
    { label: "Translate (to Spanish)", action: "translate", tooltip: "Translate selected text to Spanish" },
  ]
  return (
    <div
      ref={menuRef}
      className={`fixed z-50 flex flex-col rounded-lg shadow-xl border ${menuClasses} p-1 w-[calc(100%-2rem)] max-w-xs sm:min-w-[180px]`}
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {subMenuItems.map((item) => (
        <button
          key={item.action}
          disabled={disabled}
          onClick={() => { if (!disabled) { onAction(item.action, selectedText) } }}
          className={`w-full text-left px-3 py-2 text-sm rounded-md ${buttonClasses} ${disabled ? "opacity-50 cursor-not-allowed" : "transition-colors"} group relative`}
          title={item.tooltip}
        >
          {item.label}
          {item.tooltip && !disabled && (
            <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${tooltipClasses}`}>
              {item.tooltip}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

const CustomActionMenu = ({ x, y, selectedText, onAction, onClose, theme, disabled = false }) => {
  const menuRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) { onClose() } }
    const handleEscapeKey = (event) => { if (event.key === "Escape") { onClose() } }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [onClose])

  const menuClasses = theme === "dark" ? "bg-black border-white/30 text-white" : "bg-white border-gray-300 text-gray-700";
  const buttonClasses = theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100";
  const tooltipClasses = theme === "dark" ? "bg-white text-black" : "bg-gray-900 text-white";

  const customMenuItems = [
    { label: "Use macro", action: "use_macro", tooltip: "Apply macro to selected text" },
    { label: "Summary", action: "summary", tooltip: "Generate summary of selected text" },
    { label: "Snooze", action: "snooze", tooltip: "Snooze this content" },
  ]

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 flex flex-col rounded-lg shadow-xl border ${menuClasses} p-1 w-[calc(100%-2rem)] max-w-xs sm:min-w-[140px]`}
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {customMenuItems.map((item) => (
        <button
          key={item.action}
          disabled={disabled}
          onClick={() => { if (!disabled) { onAction(item.action, selectedText) } }}
          className={`w-full text-left px-3 py-2 text-sm rounded-md ${buttonClasses} ${disabled ? "opacity-50 cursor-not-allowed" : "transition-colors"} group relative`}
          title={item.tooltip}
        >
          {item.label}
          {item.tooltip && !disabled && (
            <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${tooltipClasses}`}>
              {item.tooltip}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

const CustomActionIcon = ({ size = 16, className = "", color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 15.5c-1.5 0-3-1-3-3s1.5-3 3-3 3 1 3 3-1.5 3-3 3" />
    <path d="M12 17.5L9 15l-3 3" />
  </svg>
)

const CustomTextareaContextMenu = ({
  x, y, selectedText, onAction, onClose, theme,
  isGlobalMenu = false, onSubMenuTrigger, onCustomActionsSubMenuTrigger,
  isTransformingText = false,
}) => {
  const menuRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickingSubMenuTrigger = event.target.closest(".chart-submenu-trigger")
      const isClickingSubMenu = event.target.closest(".fixed.z-50.flex.flex-col")
      if (menuRef.current && !menuRef.current.contains(event.target) && !isClickingSubMenuTrigger && !isClickingSubMenu) {
        onClose()
      }
    }
    const handleEscapeKey = (event) => { if (event.key === "Escape") { onClose() } }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [onClose])

  const menuClasses = theme === "dark" ? "bg-black border-white/30 text-white" : "bg-white border-gray-300 text-gray-700";
  const buttonHoverClasses = theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100";
  const tooltipClasses = theme === "dark" ? "bg-white text-black" : "bg-gray-900 text-white";
  const iconColor = theme === "dark" ? "white" : "black"; 

  const menuItems = isGlobalMenu
    ? [{ icon: <CustomChartIcon size={16} color={iconColor} theme={theme} />, action: "send_to_ai_copilot", tooltip: "Ask AI Copilot about this" }]
    : [
        { icon: <CustomChartIcon size={16} color={iconColor} theme={theme}/>, action: "chart_submenu", tooltip: "AI Actions", isSubMenuTrigger: true },
        { icon: <CustomActionIcon size={16} color={iconColor} />, action: "custom_actions_submenu", tooltip: "Custom Actions", isSubMenuTrigger: true },
        { icon: <BoldIcon size={16} />, action: "bold", tooltip: "Bold" },
        { icon: <ItalicIcon size={16} />, action: "italic", tooltip: "Italic" },
        { icon: <CodeIcon size={16} />, action: "code", tooltip: "Code" },
        { icon: <LinkIcon size={16} />, action: "link", tooltip: "Link" },
        { icon: <H1Icon size={16} />, action: "h1", tooltip: "Heading 1" },
        { icon: <H2Icon size={16} />, action: "h2", tooltip: "Heading 2" },
        { icon: <CodeIcon size={16} />, action: "code_block", tooltip: "Code Block" },
      ]
  return (
    <div
      ref={menuRef}
      className={`fixed z-40 flex flex-wrap sm:flex-nowrap rounded-lg shadow-lg border ${menuClasses} p-1 max-w-[90vw] sm:max-w-none`}
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item) => (
        <button
          key={item.action}
          disabled={item.isSubMenuTrigger && isTransformingText}
          className={`p-2 rounded-md flex items-center justify-center ${buttonHoverClasses} ${item.isSubMenuTrigger && isTransformingText ? "opacity-50 cursor-not-allowed" : "transition-colors"} group relative ${item.isSubMenuTrigger ? "chart-submenu-trigger" : ""}`}
          title={item.tooltip}
          onClick={(e) => {
            if (item.isSubMenuTrigger && !isTransformingText) {
              const buttonRect = e.currentTarget.getBoundingClientRect()
              if (item.action === "chart_submenu" && onSubMenuTrigger) onSubMenuTrigger(item.action, selectedText, buttonRect)
              else if (item.action === "custom_actions_submenu" && onCustomActionsSubMenuTrigger) onCustomActionsSubMenuTrigger(item.action, selectedText, buttonRect)
            } else if (!item.isSubMenuTrigger) {
              onAction(item.action, selectedText); onClose()
            }
          }}
        >
          {React.cloneElement(item.icon, { className: theme === 'dark' ? 'text-white' : 'text-black' })}
          {item.tooltip && !(item.isSubMenuTrigger && isTransformingText) && (
            <div className={`absolute bottom-full mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${tooltipClasses}`}>
              {item.tooltip}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

const useGlobalTextSelection = (theme) => {
  const [globalContextMenu, setGlobalContextMenu] = useState(null)
  const handleGlobalMouseUp = useCallback((event) => {
    const selection = window.getSelection(); if (!selection) return
    const selectedText = selection.toString().trim()
    if (event.target.closest(".fixed.z-40") || event.target.closest(".fixed.z-50") || event.target.closest(".chart-submenu-trigger")) return

    if (selectedText.length > 0) {
      const activeElement = document.activeElement
      const isWithinTextarea = activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT" || activeElement.isContentEditable)
      if (!isWithinTextarea) {
        const range = selection.getRangeAt(0); const rect = range.getBoundingClientRect()
        const menuWidth = 50; const menuHeight = 50; 
        let menuX = rect.left + rect.width / 2 - menuWidth / 2
        let menuY = rect.top - menuHeight - 5
        if (typeof window !== 'undefined') {
            menuX = Math.max(10, Math.min(menuX, window.innerWidth - menuWidth - 10))
            menuY = Math.max(10, menuY)
            if (rect.top - menuHeight - 5 < 10) menuY = rect.bottom + 5
        }
        setGlobalContextMenu({ x: menuX, y: menuY, selectedText: selectedText })
      }
    } else {
      if (!event.target.closest(".fixed.z-40") && !event.target.closest(".fixed.z-50")) setGlobalContextMenu(null)
    }
  }, [])

  const handleGlobalMouseDown = useCallback((event) => {
    if (!event.target.closest(".fixed.z-40") && !event.target.closest(".fixed.z-50")) setGlobalContextMenu(null)
  }, [])

  useEffect(() => {
    document.addEventListener("mouseup", handleGlobalMouseUp)
    document.addEventListener("mousedown", handleGlobalMouseDown)
    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      document.removeEventListener("mousedown", handleGlobalMouseDown)
    }
  }, [handleGlobalMouseUp, handleGlobalMouseDown])

  const closeGlobalContextMenu = useCallback(() => setGlobalContextMenu(null), [])
  return { globalContextMenu, closeGlobalContextMenu }
}

const MessageInput = forwardRef(({ draftMessage, setDraftMessage, handleSend, theme }, ref) => {
  const [contextMenu, setContextMenu] = useState(null)
  const [selectionForTransform, setSelectionForTransform] = useState(null)
  const [chartSubMenu, setChartSubMenu] = useState(null)
  const [isTransformingText, setIsTransformingText] = useState(false)
  const [customActionMenu, setCustomActionMenu] = useState(null)

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isTransformingText) { e.preventDefault(); handleSend() } 
    else if (e.key === "Escape") {
      if (chartSubMenu) { closeChartSubMenu(); e.stopPropagation() } 
      else if (customActionMenu) { closeCustomActionMenu(); e.stopPropagation() } 
      else if (contextMenu) { closeContextMenu() }
    }
  }

  useEffect(() => {
    const textarea = ref.current
    if (textarea) {
      textarea.style.height = "auto"; const scrollHeight = textarea.scrollHeight; const maxHeight = 120
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
      textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden"
    }
  }, [draftMessage, ref])

  const closeChartSubMenu = useCallback(() => setChartSubMenu(null), [])
  const closeCustomActionMenu = useCallback(() => setCustomActionMenu(null), [])
  const closeContextMenu = useCallback(() => {
    setContextMenu(null); closeChartSubMenu(); closeCustomActionMenu()
  }, [closeChartSubMenu, closeCustomActionMenu])

  const handleTextareaMouseUp = useCallback((event) => {
    const textarea = ref.current; if (!textarea || isTransformingText) return
    if (event.target.closest(".fixed.z-50.flex.flex-col")) return

    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
    const currentSelection = { start: textarea.selectionStart, end: textarea.selectionEnd, text: selectedText }

    if (selectedText.trim().length > 0) {
      const rect = textarea.getBoundingClientRect(); 
      const iconButtonWidth = 40; 
      const menuItemsCount = 9;
      let menuWidth = iconButtonWidth * menuItemsCount; 
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
          menuWidth = Math.min(menuWidth, window.innerWidth * 0.9);
      } else {
          menuWidth = Math.min(menuWidth, 400); 
      }
      const menuHeight = 50; 

      let menuX = rect.left + textarea.offsetWidth / 2 - menuWidth / 2
      let menuY = rect.top - menuHeight - 5
      
      if (typeof window !== 'undefined') {
        menuX = Math.max(10, Math.min(menuX, window.innerWidth - menuWidth - 10))
        menuY = Math.max(10, menuY)
        if (rect.top - menuHeight - 5 < 10) menuY = rect.bottom + 5
      }

      setContextMenu({ x: menuX, y: menuY, selectedText: selectedText })
      setSelectionForTransform(currentSelection); closeChartSubMenu(); closeCustomActionMenu()
    } else {
      if (!event.target.closest(".fixed.z-40")) closeContextMenu()
    }
  }, [ref, closeContextMenu, closeChartSubMenu, closeCustomActionMenu, isTransformingText])

  const handleTextareaMouseDown = useCallback((event) => {
    if (isTransformingText) return
    const isClickingMainMenu = event.target.closest(".fixed.z-40.flex")
    const isClickingSubMenu = event.target.closest(".fixed.z-50.flex.flex-col")
    if (!isClickingMainMenu && !isClickingSubMenu) {
      
      closeContextMenu() 
    }
  }, [closeContextMenu, isTransformingText])   
  const handleOpenChartSubMenu = useCallback((action, text, anchorRect) => {
    if (!anchorRect || isTransformingText || typeof window === 'undefined') return; closeCustomActionMenu()
    let subMenuX = anchorRect.right + 8; let subMenuY = anchorRect.top
    const subMenuWidth = Math.min(200, window.innerWidth - 20); 
    const subMenuHeight = 250 
    if (subMenuX + subMenuWidth > window.innerWidth - 10) subMenuX = anchorRect.left - subMenuWidth - 8
    if (subMenuY + subMenuHeight > window.innerHeight - 10) subMenuY = window.innerHeight - subMenuHeight - 10
    subMenuX = Math.max(10, subMenuX); subMenuY = Math.max(10, subMenuY)
    setChartSubMenu({ x: subMenuX, y: subMenuY, selectedText: text })
  }, [isTransformingText, closeCustomActionMenu])

  const handleCustomActionMenuAction = (action, selectedText) => {
    console.log(`Custom action: ${action} on text: "${selectedText}"`)
    closeContextMenu()
  }

  const handleOpenCustomActionMenu = useCallback((action, text, anchorRect) => {
    if (!anchorRect || isTransformingText || typeof window === 'undefined') return; closeChartSubMenu()
    let subMenuX = anchorRect.right + 8; let subMenuY = anchorRect.top
    const subMenuWidth = Math.min(160, window.innerWidth - 20); 
    const subMenuHeight = 150
    if (subMenuX + subMenuWidth > window.innerWidth - 10) subMenuX = anchorRect.left - subMenuWidth - 8
    if (subMenuY + subMenuHeight > window.innerHeight - 10) subMenuY = window.innerHeight - subMenuHeight - 10
    subMenuX = Math.max(10, subMenuX); subMenuY = Math.max(10, subMenuY)
    setCustomActionMenu({ x: subMenuX, y: subMenuY, selectedText: text })
  }, [isTransformingText, closeChartSubMenu])

  const handleChartSubMenuAction = async (subAction, textToTransform) => {
    const originalSelection = selectionForTransform
    if (!originalSelection || !originalSelection.text.trim() || isTransformingText) { closeContextMenu(); return }
    setIsTransformingText(true); closeContextMenu()
    const { start: startIndex, end: endIndex, text: originalSelectedTextValue } = originalSelection
    try {
      const response = await fetch(`http://localhost:3001/api/ai/transform-text`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ action: subAction, text: originalSelectedTextValue }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "API error" }))
        throw new Error(errorData.message || `HTTP error ${response.status}`)
      }
      const data = await response.json()
      const transformedText = data.transformedText
      if (typeof transformedText === "string") {
        const currentDraft = ref.current.value
        const newDraft = currentDraft.substring(0, startIndex) + transformedText + currentDraft.substring(endIndex)
        setDraftMessage(newDraft)
        setTimeout(() => { if (ref.current) { ref.current.focus(); ref.current.setSelectionRange(startIndex, startIndex + transformedText.length) }}, 0)
      } else { alert("Transformation failed.") }
    } catch (error) { alert(`Error: ${error.message}`) } 
    finally { setIsTransformingText(false); setSelectionForTransform(null) }
  }

  const handleContextMenuAction = (action, textToWrap) => {
    if (isTransformingText) return; const textarea = ref.current; if (!textarea) return
    const start = textarea.selectionStart; const end = textarea.selectionEnd
    const currentSelectedText = textarea.value.substring(start, end)
    let prefix = "", suffix = "", placeholder = "", selectionOffsetStart = 0
    switch (action) {
      case "bold": prefix = "**"; suffix = "**"; placeholder = "bold text"; selectionOffsetStart = 2; break
      case "italic": prefix = "*"; suffix = "*"; placeholder = "italic text"; selectionOffsetStart = 1; break
      case "code": prefix = "`"; suffix = "`"; placeholder = "code"; selectionOffsetStart = 1; break
      case "link": prefix = "["; suffix = "](url)"; placeholder = "link text"; selectionOffsetStart = 1; break
      case "h1": prefix = "# "; placeholder = "Heading 1"; selectionOffsetStart = 2; break
      case "h2": prefix = "## "; placeholder = "Heading 2"; selectionOffsetStart = 3; break
      case "code_block": prefix = "```\n"; suffix = "\n```"; placeholder = "code block"; selectionOffsetStart = 4; break
      default: return
    }
    const textToInsert = currentSelectedText || placeholder
    const newText = draftMessage.substring(0, start) + prefix + textToInsert + suffix + draftMessage.substring(end)
    setDraftMessage(newText)
    setTimeout(() => {
      if (textarea) {
        textarea.focus()
        if (currentSelectedText) textarea.setSelectionRange(start + selectionOffsetStart, start + selectionOffsetStart + textToInsert.length)
        else if (action === "link") textarea.setSelectionRange(start + prefix.length, start + prefix.length + placeholder.length)
        else { const cursorPos = start + prefix.length + textToInsert.length; textarea.setSelectionRange(cursorPos, cursorPos) }
      }
    }, 0)
  }

  const canSend = draftMessage.trim().length > 0 && !isTransformingText
  const buttonBaseClasses = "py-2 flex items-center justify-center transition-colors";
  const activeDarkClasses = "bg-white hover:bg-opacity-80 text-black";
  const inactiveDarkClasses = "bg-white/20 text-white/50 cursor-not-allowed";
  const activeLightClasses = "bg-gray-900 hover:bg-gray-800 text-white";
  const inactiveLightClasses = "bg-gray-200 text-gray-400 cursor-not-allowed";

  const activeClasses = theme === 'dark' ? activeDarkClasses : activeLightClasses;
  const inactiveClasses = theme === 'dark' ? inactiveDarkClasses : inactiveLightClasses;
  
  const iconButtonColor = theme === 'dark' ? 'text-white' : 'text-black';


  return (
    <div className={`flex flex-col rounded-lg shadow-sm relative 
                    bg-white dark:bg-black`}>
      <div className="px-3 pt-2">
        <button className={`flex items-center text-xs px-1 py-0.5 rounded-md transition-colors
                           ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-black hover:bg-gray-100'}`}>
          <MessageSquare size={14} className="mr-1 shrink-0" fill="currentColor" />
          <span className="font-medium">Chat</span>
          <ChevronDown size={14} className="ml-1 shrink-0" />
        </button>
        <div className="pb-1">
          <span className={`${theme === 'dark' ? 'text-white/50' : 'text-gray-400'} text-xs`}>Use ⌘K for shortcuts</span>
        </div>
      </div>
      <div className="relative flex-1 px-3 pb-2">
        <textarea
          ref={ref}
          className={`w-full bg-transparent outline-none resize-none text-sm leading-relaxed py-2 conversation-input
                      ${theme === 'dark' ? 'text-white placeholder-white/50' : 'text-gray-900 placeholder-gray-500'}`}
          value={draftMessage}
          onChange={(e) => setDraftMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onMouseDown={handleTextareaMouseDown}
          onMouseUp={handleTextareaMouseUp}
          rows={1}
          placeholder="Type your message..."
          aria-label="Type a message"
          disabled={isTransformingText}
        />
      </div>
      <div className={`flex items-center justify-between px-3 py-2 border-t 
                      ${theme === 'dark' ? 'border-white/20' : 'border-gray-100'}`}>
        <div className="flex items-center space-x-1">
          <button className={`${iconButtonColor} hover:opacity-70 p-1.5 rounded-md`}>
            <Zap size={18} fill="currentColor" />
          </button>
          <div className={`h-4 w-px mx-1 ${theme === 'dark' ? 'bg-white/30' : 'bg-gray-300'}`}></div>
          <button className={`${iconButtonColor} hover:opacity-70 p-1.5 rounded-md flex items-center justify-center`}>
            <CustomBookmarkIcon size={18} color="currentColor" />
          </button>
          <button className={`${iconButtonColor} hover:opacity-70 p-1.5 rounded-md flex items-center justify-center`}>
            <AddReactionIcon sx={{ fontSize: 18, color: "currentColor" }} />
          </button>
        </div>
        <div className="flex">
          <button
            className={`${buttonBaseClasses} px-3 sm:px-4 rounded-l-md ${canSend ? activeClasses : inactiveClasses}`}
            onClick={handleSend}
            disabled={!canSend || isTransformingText}
            aria-label="Send message"
          >
            <span className="font-medium text-sm sm:text-base">Send</span>
          </button>
          <button
            className={`${buttonBaseClasses} px-1.5 sm:px-2 rounded-r-md border-l 
                        ${canSend 
                            ? `${activeClasses} ${theme === 'dark' ? 'border-black' : 'border-gray-700'}` 
                            : `${inactiveClasses} ${theme === 'dark' ? 'border-white/30' : 'border-gray-300'}`
                        }`}
            disabled={!canSend || isTransformingText}
            aria-label="More send options"
          >
            <ChevronDown size={16} className="shrink-0" />
          </button>
        </div>
      </div>
      {isTransformingText && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60] rounded-lg backdrop-blur-sm">
          <div className={`p-4 rounded-md shadow-xl flex items-center space-x-2 
                          ${theme === 'dark' ? 'bg-black border border-white/30' : 'bg-white'}`}>
            <svg className={`animate-spin h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-indigo-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Transforming...</span>
          </div>
        </div>
      )}
      {contextMenu && !isTransformingText && (
        <CustomTextareaContextMenu
          x={contextMenu.x} y={contextMenu.y} selectedText={contextMenu.selectedText}
          onAction={handleContextMenuAction} onClose={closeContextMenu} theme={theme}
          isGlobalMenu={false} onSubMenuTrigger={handleOpenChartSubMenu}
          onCustomActionsSubMenuTrigger={handleOpenCustomActionMenu}
          isTransformingText={isTransformingText}
        />
      )}
      {chartSubMenu && !isTransformingText && (
        <ChartSubMenu
          x={chartSubMenu.x} y={chartSubMenu.y} selectedText={chartSubMenu.selectedText}
          onAction={handleChartSubMenuAction} onClose={closeChartSubMenu} theme={theme}
          disabled={isTransformingText}
        />
      )}
      {customActionMenu && !isTransformingText && (
        <CustomActionMenu
          x={customActionMenu.x} y={customActionMenu.y} selectedText={customActionMenu.selectedText}
          onAction={handleCustomActionMenuAction} onClose={closeCustomActionMenu} theme={theme}
          disabled={isTransformingText}
        />
      )}
    </div>
  )
})
MessageInput.displayName = "MessageInput"

export function ConversationArea({
  conversation = { name: "New Conversation", type: "char", char: "U" }, 
  messages = [],
  draftMessage = "",
  setDraftMessage = () => {},
  onSendMessage = () => {},
  draftSource = "", 
  theme = "light",
  toggleTheme = () => {},
  onSendTextToAIFromGlobal, 
  isAiAssistantDetailsTabActive = false, 
  isMobileView = false,
  onMobileNavToInbox,
  onMobileNavToAI,
}) {
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null) 
  const [mobileMoreMenuOpen, setMobileMoreMenuOpen] = useState(false);


  const handleSend = () => {
    if (draftMessage.trim()) {
      onSendMessage(draftMessage) 
    }
  }

  const { globalContextMenu, closeGlobalContextMenu } = useGlobalTextSelection(theme)

  const handleGlobalContextMenuAction = useCallback((action, selectedText) => {
    switch (action) {
      case "send_to_ai_copilot":
        if (onSendTextToAIFromGlobal) { onSendTextToAIFromGlobal(selectedText) }
        break
      default: console.log("Unknown global action:", action)
    }
    if (closeGlobalContextMenu) { closeGlobalContextMenu() }
  }, [onSendTextToAIFromGlobal, closeGlobalContextMenu])

  useEffect(() => {
    if (textareaRef.current && draftSource === "ai" && draftMessage.includes("\n")) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight
    }
  }, [draftMessage, draftSource])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const agentAvatarChar = "A" 
  const agentAvatarBgColorLight = "bg-blue-500";
  const agentAvatarBgColorDark = "bg-white"; 
  const agentAvatarTextColorLight = "text-white";
  const agentAvatarTextColorDark = "text-black"; 
  
  const agentAvatarBgColor = theme === 'dark' ? agentAvatarBgColorDark : agentAvatarBgColorLight;
  const agentAvatarTextColor = theme === 'dark' ? agentAvatarTextColorDark : agentAvatarTextColorLight;


  const HeaderButton = ({ onClick, children, className = "", ariaLabel, isPrimary = false }) => (
    <button
      onClick={onClick} aria-label={ariaLabel}
      className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors 
                  ${isPrimary 
                      ? (theme === "dark" ? "bg-white text-black hover:bg-opacity-80" : "bg-gray-800 text-white hover:bg-gray-700") 
                      : (theme === "dark" ? "bg-black border border-white/30 text-white hover:bg-white/10" : "bg-gray-200 text-gray-700 hover:bg-gray-300")
                  } ${className}`}
    >
      {children}
    </button>
  )

  const IconOnlyButton = ({ onClick, children, className = "", ariaLabel }) => (
    <button
      onClick={onClick} aria-label={ariaLabel}
      className={`p-1.5 sm:p-2 rounded-lg transition-colors 
                  ${theme === "dark" ? "text-white bg-black border border-white/30 hover:bg-white/10" : "text-gray-600 bg-gray-200 hover:bg-gray-300"} 
                  ${className}`}
    >
      {children}
    </button>
  )

  const MobileMoreMenu = () => (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-white/30 rounded-md shadow-lg z-50">
        <button
            onClick={() => { toggleTheme(); setMobileMoreMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
        >
            {theme === "dark" ? <Sun size={18} fill="currentColor" /> : <NewCustomMoonWithZIcon size={18} />}
            <span>Switch to {theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        <button
            className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
        >
            <CustomCloseBoxIcon size={16} color="currentColor" />
            <span>Close Conversation</span>
        </button>
    </div>
);


  return (
    <div className={`flex flex-col h-full w-full relative
                    ${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"}`}>
      <div className={`absolute bottom-0 left-0 right-0 h-[15%] sm:h-[25%] pointer-events-none z-0
                      bg-gradient-to-t from-gray-100 via-gray-50 to-transparent
                      dark:from-black/80 dark:via-black/50 dark:to-transparent`} />
      
      <div className={`flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 mb-1 border-b relative z-20 
                      ${theme === "dark" ? "border-white/20 bg-black" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center gap-2">
            {isMobileView && onMobileNavToInbox && (
                 <button onClick={onMobileNavToInbox} aria-label="Back to Inbox" className={`p-1.5 rounded-md ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-black hover:bg-gray-100'}`}>
                    <ArrowLeft size={20} />
                </button>
            )}
          {!isAiAssistantDetailsTabActive && (
            <h2 className="text-base sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-xs">
                {conversation?.name || "New Conversation"}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {isMobileView ? (
             <>
                {onMobileNavToAI && (
                    <button onClick={onMobileNavToAI} aria-label="Open AI Assistant" className={`p-1.5 rounded-md ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-black hover:bg-gray-100'}`}>
                        <CustomChartIcon size={20} color={theme === 'dark' ? 'white' : 'black'} theme={theme} />
                    </button>
                )}
                <div className="relative">
                    <button
                        onClick={() => setMobileMoreMenuOpen(prev => !prev)}
                        aria-label="More options"
                        className={`p-1.5 rounded-md ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-black hover:bg-gray-100'}`}
                    >
                        <MoreHorizontal size={20} />
                    </button>
                    {mobileMoreMenuOpen && <MobileMoreMenu />}
                </div>
             </>
          ) : isAiAssistantDetailsTabActive ? (
            <>
              <IconOnlyButton ariaLabel="Favorite">
                <Star size={18} className={`${theme === "dark" ? "text-white" : "text-gray-700"}`} />
              </IconOnlyButton>
              <IconOnlyButton ariaLabel="More options">
                <MoreHorizontal size={20} className={`${theme === "dark" ? "text-white" : "text-gray-700"}`} />
              </IconOnlyButton>
              <IconOnlyButton ariaLabel="Split view">
                <SplitSquareHorizontal size={18} className={`${theme === "dark" ? "text-white" : "text-gray-700"}`} />
              </IconOnlyButton>
              <HeaderButton ariaLabel="Call"> <Phone size={16} /> Call </HeaderButton>
              <HeaderButton ariaLabel="Snooze"> <NewCustomMoonWithZIcon size={18} /> Snooze </HeaderButton>
              <HeaderButton ariaLabel="Close Conversation" isPrimary={true}> <Archive size={16} /> Close </HeaderButton>
            </>
          ) : (
            <>
              <IconOnlyButton ariaLabel="More options">
                <MoreHorizontal size={20} className={`${theme === "dark" ? "text-white" : "text-gray-700"}`} />
              </IconOnlyButton>
              <button
                onClick={toggleTheme}
                className={`p-1.5 rounded-md transition-colors
                            ${theme === "dark" ? "text-white bg-black border border-white/30 hover:bg-white/10" : "text-gray-600 bg-gray-200 hover:bg-gray-300"}`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun size={20} fill="currentColor" /> : <NewCustomMoonWithZIcon size={20} />}
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 
                            ${theme === "dark" ? "bg-white text-black hover:bg-opacity-80" : "bg-gray-900 text-white hover:bg-black"}`}
              >
                <CustomCloseBoxIcon size={16} color="currentColor" />
                Close
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className={`flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 relative z-10
                      ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        {messages.map((message) => {
          const isAgent = message.sender === "agent"
          let avatarContent, avatarBgClass, avatarTextClass, avatarExtraStyles = ""

          if (isAgent) {
            avatarContent = <span className={agentAvatarTextColor}>{message.avatar || agentAvatarChar}</span>
            avatarBgClass = agentAvatarBgColor;
          } else { 
            avatarBgClass = conversation?.avatarColorClass || (theme === "dark" ? "bg-white" : "bg-gray-400"); 
            avatarTextClass = conversation?.avatarTextColorClass || (theme === "dark" ? "text-black" : "text-white"); 
            avatarExtraStyles = conversation?.avatarExtraClasses || "";

            if (conversation?.type === "icon" && conversation.iconComponent) {
              const IconComponent = conversation.iconComponent
              avatarContent = <IconComponent size={16} strokeWidth={2.5} className={avatarTextClass} />
            } else {
              const charToDisplay = conversation?.avatarChar || conversation?.char || "?"
              avatarContent = <span className={avatarTextClass}>{charToDisplay}</span>
            }
          }
          
          const agentBubbleLight = "bg-indigo-200 text-slate-800 rounded-br-none";
          const agentBubbleDark = "bg-white text-black rounded-br-none"; 
          const customerBubbleLight = "bg-gray-200 text-gray-800 rounded-bl-none";
          const customerBubbleDark = "bg-black border border-white/30 text-white rounded-bl-none";

          const bubbleClasses = isAgent 
            ? (theme === 'dark' ? agentBubbleDark : agentBubbleLight)
            : (theme === 'dark' ? customerBubbleDark : customerBubbleLight);

          const agentTimeLight = "text-slate-600";
          const agentTimeDark = "text-black/70"; 
          const customerTimeLight = "text-gray-500";
          const customerTimeDark = "text-white/70"; 

          const timeClasses = isAgent
            ? (theme === 'dark' ? agentTimeDark : agentTimeLight)
            : (theme === 'dark' ? customerTimeDark : customerTimeLight);

          return (
            <div key={message.id} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end gap-2 max-w-[80%] sm:max-w-[70%] ${isAgent ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm shrink-0 ${avatarBgClass} ${avatarExtraStyles}`}>
                  {avatarContent}
                </div>
                <div className={`rounded-xl p-2 sm:p-3 text-sm shadow-md ${bubbleClasses}`}>
                  <p style={{ whiteSpace: "pre-line" }}>{message.text}</p>
                  <div className={`text-xs mt-1 ${timeClasses}`}>
                    {message.time}
                    {isAgent && message.seen && " · Seen"}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <div className={`p-2 sm:p-4 relative z-30 
                      ${theme === "dark" ? "bg-black border-t border-white/20" : "bg-white border-t border-gray-100"}`}>
        <MessageInput
          ref={textareaRef} 
          draftMessage={draftMessage}
          setDraftMessage={setDraftMessage} 
          handleSend={handleSend}
          theme={theme}
        />
      </div>
      
      {globalContextMenu && (
        <CustomTextareaContextMenu
          x={globalContextMenu.x} y={globalContextMenu.y} selectedText={globalContextMenu.selectedText}
          onAction={handleGlobalContextMenuAction} onClose={closeGlobalContextMenu}
          theme={theme} isGlobalMenu={true}
        />
      )}
    </div>
  )
}