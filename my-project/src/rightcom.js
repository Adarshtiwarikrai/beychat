
"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Send, Edit3, Sparkles, MessageSquare, ArrowRight,
  ChevronDown, ChevronUp, Plus, User, Users,
  ExternalLink, Columns,
  Copy,
  GitFork, ClipboardCheck, ArrowUpRight
} from "lucide-react"
import { useMediaQuery } from './utils'; 

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";


const FinCopilotLogo = ({
  size = 48,
  className = "",
  color = "currentColor",
  isAnimating = false,
  simpleDisplay = false,
  theme
}) => {
  const defaultBarHeights = [14, 18, 14];
  const [barHeights, setBarHeights] = useState(defaultBarHeights);

  useEffect(() => {
    let intervalId;
    if (isAnimating && !simpleDisplay) {
      const patterns = [
        [10, 18, 10], [14, 12, 14], [18, 16, 18],
        [12, 18, 12], [16, 10, 16],
      ];
      let patternIndex = 0;
      intervalId = setInterval(() => {
        setBarHeights(patterns[patternIndex]);
        patternIndex = (patternIndex + 1) % patterns.length;
      }, 250);
    } else {
      setBarHeights(defaultBarHeights);
    }
    return () => clearInterval(intervalId);
  }, [isAnimating, simpleDisplay]);

  const barBottomY = 38;
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
            <path d="M22 48 Q32 54 42 48" stroke={smileStroke} strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
        </>
      )}
    </svg>
  );
};

const formatChatHistoryForAI = (messages) => {
  if (!messages || messages.length === 0) {
    return "";
  }
  return messages
    .map(msg => `${msg.sender === 'agent' ? 'Agent' : 'Customer'}: ${msg.text}`)
    .join("\n");
};


const AssigneeTeamItem = ({ label, value, icon, imageUrl, theme, isDesktop }) => (
  <div className="flex items-center py-1.5">
    <span className={`text-xs sm:text-sm w-20 sm:w-24 flex-shrink-0 ${theme === 'dark' ? 'text-white/70' : 'text-gray-500'}`}>{label}</span>
    <div className="flex items-center space-x-2 sm:space-x-2.5">
      {imageUrl ? (
        <img src={imageUrl} alt={label} className="w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full object-cover" />
      ) : icon ? (
        React.cloneElement(icon, { size: isDesktop ? 18 : 16, className: `${theme === 'dark' ? 'text-white' : 'text-black'}` })
      ) : null}
      <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</span>
    </div>
  </div>
);

const LinkItem = ({ icon, label, onAdd, iconStyle, theme, isDesktop }) => (
  <div className={`flex justify-between items-center py-1 sm:py-1.5 group -mx-1 px-1 rounded-md
                  hover:bg-gray-100
                  dark:hover:bg-white/10`}>
    <div className="flex items-center space-x-2 sm:space-x-2.5">
      {icon && React.cloneElement(icon, {
        size: isDesktop ? 16 : 14,
        className: `${theme === 'dark' ? 'text-white' : 'text-black'}`,
        style: iconStyle
      })}
      <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{label}</span>
    </div>
    <button
      onClick={onAdd}
      className={`p-1 sm:p-1.5 rounded-full transition-colors
                  text-gray-500 hover:text-purple-600 hover:bg-purple-100
                  dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10`}
      aria-label={`Add ${label}`}
    >
      <Plus size={isDesktop ? 16 : 14} />
    </button>
  </div>
);

const DetailSection = ({ title, isExpanded, onToggle, children, iconLogic = "standard", theme, isDesktop }) => (
  <div className={`py-2 sm:py-3 border-b last:border-b-0 ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
    <button
      onClick={onToggle}
      className={`flex justify-between items-center w-full text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1 transition-colors
                  text-gray-600 hover:text-gray-800
                  dark:text-white/70 dark:hover:text-white`}
      aria-expanded={isExpanded}
    >
      <span>{title}</span>
      {iconLogic === "standard" ? (
        isExpanded ? <ChevronUp size={isDesktop ? 16 : 14} /> : <ChevronDown size={isDesktop ? 16 : 14} />
      ) : (
        isExpanded ? <ChevronDown size={isDesktop ? 16 : 14} /> : <ChevronUp size={isDesktop ? 16 : 14} />
      )}
    </button>
    {isExpanded && <div className="pt-1 space-y-0.5">{children}</div>}
  </div>
);


export function AIAssistant({
  conversationContext,
  mainChatHistory,
  onComposeMessage,
  theme,
  globallySelectedTextData,
  onTabChange
}) {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const [chatHistory, setChatHistory] = useState([])
  const [inputText, setInputText] = useState("")
  const [isReceiving, setIsReceiving] = useState(false)
  const [activeTab, _setActiveTab] = useState("AiCOpilot")
  const [sessionId, setSessionId] = useState(
    () => `copilot-session-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  )

  const eventSourceRef = useRef(null)
  const chatContainerRef = useRef(null)
  const aiInputRef = useRef(null);

  const [linksExpanded, setLinksExpanded] = useState(true);
  const [userDataExpanded, setUserDataExpanded] = useState(true);
  const [convAttributesExpanded, setConvAttributesExpanded] = useState(true);
  const [companyDetailsExpanded, setCompanyDetailsExpanded] = useState(true);
  const [salesforceExpanded, setSalesforceExpanded] = useState(true);
  const [stripeExpanded, setStripeExpanded] = useState(true);
  const [jiraExpanded, setJiraExpanded] = useState(true);

  const suggestedPromptsList = [
    "Summarize this conversation.", "What were the main topics ?",
    "Are there any action items for me?", "Draft a polite follow-up.",
  ];

  const setActiveTab = (newTab) => {
    _setActiveTab(newTab);
    if (onTabChange) {
      onTabChange(newTab);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory, activeTab])

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [sessionId])

  useEffect(() => {
    if (conversationContext && conversationContext.id) {
      const newSessionId = `copilot-session-${conversationContext.id}-${Date.now()}`
      if (sessionId.split('-')[2] !== String(conversationContext.id)) {
        setSessionId(newSessionId); setChatHistory([]);
        if (eventSourceRef.current) { eventSourceRef.current.close(); eventSourceRef.current = null; }
      }
    } else {
      const genericSessionId = `copilot-session-general-${Date.now()}`;
      if (!sessionId.includes("general")) {
        setSessionId(genericSessionId); setChatHistory([]);
        if (eventSourceRef.current) { eventSourceRef.current.close(); eventSourceRef.current = null;}
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationContext]);

  const autoResizeTextarea = (textareaElement) => {
    if (!textareaElement) return;
    textareaElement.style.height = 'auto';
    const scrollHeight = textareaElement.scrollHeight;
    const maxHeight = 100;
    textareaElement.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    textareaElement.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    if (globallySelectedTextData && globallySelectedTextData.text) {
      setInputText(globallySelectedTextData.text);
      setActiveTab("AiCOpilot");
      if (aiInputRef.current) {
        aiInputRef.current.focus();
        requestAnimationFrame(() => autoResizeTextarea(aiInputRef.current));
      }
    }
  }, [globallySelectedTextData]);

  const handleSend = async (directMessage = null) => {
    const messageContent = directMessage || inputText;
    if (!messageContent.trim() || isReceiving) {
      if (directMessage && !messageContent.trim()) setInputText("");
      return;
    }

    setInputText("");
    if (aiInputRef.current) requestAnimationFrame(() => autoResizeTextarea(aiInputRef.current));

    const userMessage = { id: `user-${Date.now()}`, role: "user", content: messageContent };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsReceiving(true);

    const assistantMessageId = `assistant-${Date.now()}`;
    const initialStatusText = mainChatHistory?.length > 0 ? "Thinking based on conversation..." : "Thinking...";
    const initialAssistantMessage = {
      id: assistantMessageId, role: "assistant", content: "", isStreaming: true,
      showComposeButton: false, hasContent: false, statusText: initialStatusText,
      sources: [], sourceCount: 0, isStatusPhase: true,
    };
    setChatHistory((prev) => [...prev, initialAssistantMessage]);

    if (eventSourceRef.current) eventSourceRef.current.close();
    const queryParams = new URLSearchParams({ message: messageContent, sessionId });
    const formattedMainChatContext = formatChatHistoryForAI(mainChatHistory);
    if (formattedMainChatContext) queryParams.append('chatContext', formattedMainChatContext);
    const url = `${BACKEND_URL}/api/ai/chat?${queryParams.toString()}`;
    const newEventSource = new EventSource(url);
    eventSourceRef.current = newEventSource;
    let accumulatedResponse = "";
    let receivedMainContent = false;

    newEventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "status_update") {
          setChatHistory((prev) => prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, statusText: parsedData.text } : msg)));
        } else if (parsedData.type === "sources_list") {
          setChatHistory((prev) => prev.map((msg) => msg.id === assistantMessageId ? { ...msg, sources: parsedData.sources, statusText: "Researching sources I found..." } : msg));
        } else if (parsedData.chunk) {
          if (!receivedMainContent) {
            setChatHistory((prev) => prev.map((msg) => msg.id === assistantMessageId ? { ...msg, isStatusPhase: false, hasContent: true, isStreaming: true } : msg));
            receivedMainContent = true;
          }
          accumulatedResponse += parsedData.chunk;
          setChatHistory((prev) => prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: accumulatedResponse } : msg)));
        } else if (parsedData.endOfStream) {
          setChatHistory((prev) => prev.map((msg) => msg.id === assistantMessageId ? {
            ...msg, content: parsedData.fullResponse || accumulatedResponse, isStreaming: false,
            showComposeButton: true, hasContent: !!(parsedData.fullResponse || accumulatedResponse),
            isStatusPhase: false, sourceCount: parsedData.sourceCount || (msg.sources?.length || 0),
          } : msg));
          setIsReceiving(false);
          if (eventSourceRef.current) { eventSourceRef.current.close(); eventSourceRef.current = null; }
        }
      } catch (e) { console.error("Error parsing SSE data:", e, "Raw data:", event.data); }
    };
    newEventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      setChatHistory((prev) => prev.map((msg) => msg.id === assistantMessageId ? {
        ...msg, content: "⚠️ Error connecting to AI assistant. Please try again.",
        isStreaming: false, showComposeButton: false, hasContent: true, isStatusPhase: false,
      } : msg));
      setIsReceiving(false);
      if (eventSourceRef.current) { eventSourceRef.current.close(); eventSourceRef.current = null; }
    };
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const handleCompose = (messageContent) => { onComposeMessage(messageContent); };

  const getAssistantMessageStyle = (currentTheme, messageHasContent, showButton) => {
    const basePadding = "0.625rem";
    const paddingBottom = showButton || messageHasContent ? "3rem" : "0.625rem";
    const baseStyle = { paddingTop: basePadding, paddingLeft: basePadding, paddingRight: basePadding, paddingBottom: paddingBottom, minHeight: showButton || messageHasContent ? "auto" : "2.25rem" };
    if (currentTheme === "dark") return { ...baseStyle, background: "white", color: "black" };
    return { ...baseStyle, background: "linear-gradient(135deg, rgba(180, 160, 250, 0.65) 0%, rgba(167, 139, 250, 0.35) 25%, rgba(229, 189, 227, 0.45) 100%)", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0,0,0,0.02) inset", color: "#374151" };
  };

  const handleSuggestedPrompt = async (prompt) => {
    await handleSend(prompt);if (aiInputRef.current) aiInputRef.current.focus();
  };

  const handleTextareaChange = (e) => { setInputText(e.target.value); autoResizeTextarea(e.target); };

  // MODIFIED: Changed after:bottom-0 to after:bottom-[-1px]
  const activeTabLightClasses = "bg-gradient-to-r from-indigo-400 via-indigo-400 via-[20%] to-purple-500 bg-clip-text text-transparent font-semibold relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:h-[2px] after:bg-gradient-to-r after:from-indigo-400 after:via-indigo-400 after:via-[20%] after:to-purple-500";
  const activeTabDarkClasses = "text-white font-semibold relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:h-[2px] after:bg-white";
  const activeTabClasses = theme === 'dark' ? activeTabDarkClasses : activeTabLightClasses;

  const inactiveTabLightClasses = "text-[#6B7280] hover:text-[#374151] border-b-2 border-transparent";
  const inactiveTabDarkClasses = "text-white/70 hover:text-white border-b-2 border-transparent";
  const inactiveTabClasses = theme === 'dark' ? inactiveTabDarkClasses : inactiveTabLightClasses;

  const isAiCopilotTabActive = activeTab === "AiCOpilot";

  const finLogoTabColorLight = isAiCopilotTabActive ? "#4F46E5" : "#6B7280";
  const finLogoTabColorDark = isAiCopilotTabActive ? "white" : "rgba(255,255,255,0.7)";
  const finLogoTabColor = theme === 'dark' ? finLogoTabColorDark : finLogoTabColorLight;

  const showSuggestedPrompts = chatHistory.length === 0 && !isReceiving && !inputText;
  const getWelcomeMessage = () => conversationContext?.id ? "Ask me anything about this conversation, or paste text to discuss." : "Select a conversation and I can help. Or ask a general question.";

  return (
    <div className={`flex flex-col h-full relative w-full
                    bg-white text-gray-900
                    dark:bg-black dark:text-white`}>
      <div className={`absolute bottom-0 left-0 right-0 h-[20%] sm:h-[30%] pointer-events-none z-0
                      bg-gradient-to-t from-purple-200/70 via-purple-100/50 to-transparent
                      dark:from-black/50 dark:via-black/30 dark:to-transparent`} />

      <div className={`flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 pb-0 relative z-10
                      border-b border-gray-200 bg-white
                      dark:border-white/20 dark:bg-black`}>
        <div className="flex space-x-3 sm:space-x-6">
          <button
            className={`flex items-center space-x-1.5 sm:space-x-2 pb-2.5 sm:pb-3.5 text-sm focus:outline-none ${isAiCopilotTabActive ? activeTabClasses : inactiveTabClasses}`}
            onClick={() => setActiveTab("AiCOpilot")}
          >
            <FinCopilotLogo size={isDesktop ? 16 : 14} color={finLogoTabColor} isAnimating={false} simpleDisplay={false} theme={theme}/>
            <span>AI Copilot</span>
          </button>
          <button
            className={`pb-2.5 sm:pb-3.5 text-sm focus:outline-none ${activeTab === "Details" ? activeTabClasses : inactiveTabClasses}`}
            onClick={() => setActiveTab("Details")}
          >
            Details
          </button>
        </div>
        <div className="flex items-center space-x-1.5 sm:space-x-3 pb-2.5 sm:pb-3">
            {activeTab === "Details" && (
                <>
                    <button className={`p-1 sm:p-1.5 transition-colors
                                      text-gray-500 hover:text-gray-700
                                      dark:text-white/70 dark:hover:text-white`} aria-label="External Link">
                        <ExternalLink size={isDesktop ? 18 : 16} />
                    </button>
                    <button className={`p-1 sm:p-1.5 transition-colors
                                      text-gray-500 hover:text-gray-700
                                      dark:text-white/70 dark:hover:text-white`} aria-label="Layout Options">
                        <Columns size={isDesktop ? 18 : 16} />
                    </button>
                </>
            )}
            {activeTab === "AiCOpilot" && (
                 <button className={`p-1 sm:p-1.5 transition-colors
                                    text-gray-500 hover:text-gray-700
                                    dark:text-white/70 dark:hover:text-white`} aria-label="Copy Chat Info">
                    <Copy size={isDesktop ? 18 : 16} />
                </button>
            )}
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto bg-transparent dark:bg-transparent relative z-[5]"
      >
        {activeTab === "AiCOpilot" ? (
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 h-full">
            {chatHistory.length === 0 && !isReceiving && !inputText && (
              <div className="flex flex-col items-center justify-center h-full text-center pt-6 sm:pt-10 text-gray-900 dark:text-white">
                <FinCopilotLogo size={isDesktop ? 56 : 48} className="mb-4 sm:mb-6" color={theme === "dark" ? "white" : "#1F2937"} isAnimating={false} simpleDisplay={false} theme={theme}/>
                <h2 className="text-lg sm:text-xl font-semibold mb-1">Hi, I'm Fin AI Copilot</h2>
                <p className={`text-xs sm:text-sm mb-4 sm:mb-6 ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>{getWelcomeMessage()}</p>
              </div>
            )}
            {chatHistory.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "items-start space-x-2 sm:space-x-3"}`}>
                {message.role === "assistant" && (
                  <FinCopilotLogo size={isDesktop ? 32 : 28} className="mt-1 flex-shrink-0" color={theme === "dark" ? "white" : "#4B5563"} isAnimating={message.isStreaming} simpleDisplay={false} theme={theme}/>
                )}
                <div
                  className={`max-w-[85%] rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-sm relative transition-[padding] duration-200 ease-in-out ${
                    message.role === "user"
                      ? `p-2.5 sm:p-3 rounded-br-none ${theme === 'dark' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-800'}`
                      : message.isStatusPhase ? "p-2.5 sm:p-3"
                      : message.hasContent ? "rounded-bl-none" : "p-2.5 sm:p-3 rounded-bl-none"
                  }`}
                  style={ message.role === "assistant" && !message.isStatusPhase && message.hasContent
                      ? getAssistantMessageStyle(theme, message.hasContent, message.showComposeButton)
                      : message.role === "assistant" && message.isStatusPhase
                        ? { color: theme === "dark" ? "black" : "#4b5563" }
                        : {}
                  }
                >
                  {message.role === "assistant" && message.isStatusPhase ? (
                    <>
                      <p className="text-xs sm:text-sm">{message.statusText}</p>
                      {message.sources?.length > 0 && (
                        <ul className="mt-1.5 sm:mt-2 space-y-1 sm:space-y-1.5">
                          {message.sources.map((source, index) => (
                            <li key={index} className={`flex items-center text-[11px] sm:text-xs cursor-pointer hover:underline
                                                      ${theme === 'dark' ? 'text-black/80' : 'text-purple-600'}`}>
                              <MessageSquare size={isDesktop ? 14 : 12} className="mr-1.5 sm:mr-2 opacity-70 flex-shrink-0" />
                              <span>{source}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <div style={{ whiteSpace: "pre-line" }} className={`min-h-[1em]`}>
                      {message.content}
                      {message.isStreaming && message.role === "assistant" && message.hasContent && (
                        <span className={`inline-block w-0.5 h-3 sm:h-4 ml-0.5 sm:ml-1 align-bottom animate-pulse ${theme === "dark" ? "bg-black/50" : "bg-slate-600"}`}></span>
                      )}
                    </div>
                  )}
                  {message.role === "assistant" && !message.isStreaming && (
                    <>
                      {message.sourceCount > 0 && (
                        <div className={`mt-2 sm:mt-3 pt-1.5 sm:pt-2 text-[11px] sm:text-xs
                                        border-t ${theme === 'dark' ? 'border-black/20' : 'border-gray-300/30'}`}>
                          <p className={`${theme === 'dark' ? 'text-black/70' : 'text-gray-600'} mb-1`}>{message.sourceCount} relevant sources found</p>
                          {message.sources?.slice(0, 3).map((source, index) => (
                            <li key={`detail-${index}`} className={`flex items-center cursor-pointer hover:underline text-[11px] sm:text-xs mb-0.5 list-none
                                                                  ${theme === 'dark' ? 'text-black/80' : 'text-purple-600'}`}>
                              <MessageSquare size={isDesktop ? 13 : 11} className="mr-1 sm:mr-1.5 opacity-70 flex-shrink-0" />
                              <span>{source}</span>
                            </li>
                          ))}
                          {message.sources && message.sources.length > 3 && (
                            <button className={`flex items-center hover:underline font-medium mt-1 text-[11px] sm:text-xs
                                              ${theme === 'dark' ? 'text-black/80' : 'text-purple-600'}`}>
                                See all <ArrowRight size={isDesktop ? 13 : 11} className="ml-1" />
                            </button>
                          )}
                        </div>
                      )}
                      {message.showComposeButton && !message.content.startsWith("⚠️") && (
                        <div className="absolute bottom-0 left-0 right-0 px-2 sm:px-3 pb-2 sm:pb-2.5 pt-1">
                          <button
                            onClick={() => handleCompose(message.content)}
                            className={`w-full flex items-center justify-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs font-medium py-1.5 sm:py-2 rounded shadow-sm transition-colors backdrop-blur-sm
                                        ${theme === "dark"
                                            ? "bg-black/5 hover:bg-black/10 text-black border border-black/10 hover:border-black/20"
                                            : "bg-white/80 hover:bg-white text-slate-700 hover:text-slate-800 border border-slate-300/70 hover:border-slate-400/70"}`}
                            title="Add to composer"
                          >
                            <Edit3 size={isDesktop ? 14 : 12} />
                            <span>Add to composer</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 sm:p-4 text-xs sm:text-sm">
            <div className={`mb-1 pb-2 sm:pb-3 border-b ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
              <AssigneeTeamItem theme={theme} isDesktop={isDesktop}
                label="Assignee" value="Brian Byrne"
                imageUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
              />
              <AssigneeTeamItem theme={theme} isDesktop={isDesktop} label="Team" value="Unassigned" icon={<Users />} />
            </div>

            <DetailSection theme={theme} isDesktop={isDesktop} title="LINKS" isExpanded={linksExpanded} onToggle={() => setLinksExpanded(!linksExpanded)} iconLogic="inverted">
              <LinkItem theme={theme} isDesktop={isDesktop} icon={<GitFork />} label="Tracker ticket" onAdd={() => console.log("Add Tracker ticket")} iconStyle={{ transform: 'rotate(-90deg)' }} />
              <LinkItem theme={theme} isDesktop={isDesktop} icon={<ClipboardCheck />} label="Back-office tickets" onAdd={() => console.log("Add Back-office tickets")} />
              <LinkItem theme={theme} isDesktop={isDesktop} icon={<ArrowUpRight />} label="Side conversations" onAdd={() => console.log("Add Side conversations")} />
            </DetailSection>

            <DetailSection theme={theme} isDesktop={isDesktop} title="USER DATA" isExpanded={userDataExpanded} onToggle={() => setUserDataExpanded(!userDataExpanded)} />
            <DetailSection theme={theme} isDesktop={isDesktop} title="CONVERSATION ATTRIBUTES" isExpanded={convAttributesExpanded} onToggle={() => setConvAttributesExpanded(!convAttributesExpanded)} />
            <DetailSection theme={theme} isDesktop={isDesktop} title="COMPANY DETAILS" isExpanded={companyDetailsExpanded} onToggle={() => setCompanyDetailsExpanded(!companyDetailsExpanded)} />
            <DetailSection theme={theme} isDesktop={isDesktop} title="SALESFORCE" isExpanded={salesforceExpanded} onToggle={() => setSalesforceExpanded(!salesforceExpanded)} />
            <DetailSection theme={theme} isDesktop={isDesktop} title="STRIPE" isExpanded={stripeExpanded} onToggle={() => setStripeExpanded(!stripeExpanded)} />
            <DetailSection theme={theme} isDesktop={isDesktop} title="JIRA FOR TICKETS" isExpanded={jiraExpanded} onToggle={() => setJiraExpanded(!jiraExpanded)} />
          </div>
        )}
      </div>

      {activeTab === "AiCOpilot" && (
         <div className={`p-2 sm:p-4 relative z-10 bg-transparent dark:bg-transparent`}>
          {showSuggestedPrompts && (
            <div className="mb-2 sm:mb-3">
              <p className={`text-[11px] sm:text-xs text-center mb-1.5 sm:mb-2 ${theme === 'dark' ? 'text-white/70' : 'text-gray-500'}`}>Try asking:</p>
              <div className="flex flex-col items-start space-y-1.5 sm:space-y-2">
                {suggestedPromptsList.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt)}
                     className={`flex items-center space-x-1.5 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border cursor-pointer transition-colors text-xs sm:text-sm text-left group w-full
                               ${theme === 'dark'
                                   ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white'
                                   : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                               }`}
                  >
                    <Sparkles size={isDesktop ? 16 : 14} className={`flex-shrink-0 group-hover:scale-110 transition-transform
                                                 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                    <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={`flex items-end rounded-lg pl-3 sm:pl-4 pr-1.5 sm:pr-2 py-0.5 sm:py-1
                          bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700`}>
            <textarea
              ref={aiInputRef}
              placeholder="Ask a question..."
              className={`flex-1 py-1.5 sm:py-2 bg-transparent outline-none text-xs sm:text-sm resize-none w-full ai-assistant-input-selector
                          placeholder-gray-500 text-gray-900
                          dark:placeholder-white/50 dark:text-white`}
              value={inputText}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={isReceiving}
              rows={1}
              style={{ overflowY: 'hidden' }}
            />
            <button
              className={`p-1.5 sm:p-2 rounded-md transition-colors ml-1.5 sm:ml-2 mb-0.5 sm:mb-1 ${
                inputText.trim() && !isReceiving
                  ? (theme === 'dark' ? "bg-white text-black hover:bg-opacity-80" : "bg-purple-600 text-white hover:bg-purple-700")
                  : (theme === 'dark' ? "text-white/50 bg-white/20 cursor-not-allowed" : "text-gray-400 bg-gray-200 cursor-not-allowed")
              }`}
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isReceiving}
              aria-label="Send message"
            >
              <Send size={isDesktop ? 18 : 16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}