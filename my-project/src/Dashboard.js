
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Inbox, MessageCircle, BrainCircuit } from 'lucide-react';
import { AIAssistant } from './rightcom'; 
import { ConversationArea } from './chat'; 
import { InboxSidebar, ResizablePanel } from './leftcom'; 
import { useMediaQuery } from './utils'; 

const initialMessagesByConversationId = {
  1: [
    { id: 1, sender: 'customer', text: 'I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you would be able to refund me as it is unopened.', time: '45m', avatar: 'L' },
    { id: 2, sender: 'agent', text: 'Let me just look into this for you, Luis.', time: '44m', seen: true, avatar: 'T' }
  ],
  2: [
    { id: 1, sender: 'customer', text: 'Hi there, I have a question about my recent order #IVN123.', time: '30m', avatar: 'I' },
    { id: 2, sender: 'agent', text: 'Hello Ivan, I can certainly help with that. Could you please provide more details?', time: '28m', seen: true, avatar: 'T' },
    { id: 3, sender: 'customer', text: 'The tracking shows delivered, but I haven\'t received the package yet.', time: '25m', avatar: 'I' }
  ],
  3: [
    { id: 1, sender: 'customer', text: 'Good morning, I\'m interested in learning more about your enterprise solutions.', time: '40m', avatar: 'L' },
    { id: 2, sender: 'agent', text: 'Good morning! I can help with that. What specific solutions are you interested in?', time: '38m', seen: false, avatar: 'T' }
  ],
  4: [
    { id: 1, sender: 'customer', text: 'We are experiencing intermittent 503 errors with the `/availability` endpoint.', time: '1h', avatar: 'MS' },
    { id: 2, sender: 'agent', text: 'Thanks for the report. We are investigating this urgently. Can you provide a timeframe?', time: '55m', seen: true, avatar: 'T' }
  ],
  5: [
    { id: 1, sender: 'customer', text: 'Hey there, I\'m following up on the quote request I sent last week for project X.', time: '2h', avatar: 'CL' },
    { id: 2, sender: 'agent', text: 'Hello Miracle, let me check the status of your quote request right away.', time: '1h 58m', seen: false, avatar: 'T' }
  ],
};


export default function SupportDashboard() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [draftSource, setDraftSource] = useState(null);
  const [theme, setTheme] = useState('light');
  const [allConversationsMessages, setAllConversationsMessages] = useState(initialMessagesByConversationId);
  const [currentConversationMessages, setCurrentConversationMessages] = useState([]);
  const [globallySelectedTextForAI, setGloballySelectedTextForAI] = useState(null);
  const [isAiAssistantDetailsTabActive, setIsAiAssistantDetailsTabActive] = useState(false);

  const isMobile = useMediaQuery('(max-width: 767px)');
  const [currentMobileView, setCurrentMobileView] = useState('inbox');


  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        if (theme === 'dark') {
        root.classList.add('dark');
        } else {
        root.classList.remove('dark');
        }
    }
  }, [theme]);

  useEffect(() => {
    if (selectedConversation && selectedConversation.id) {
      setCurrentConversationMessages(allConversationsMessages[selectedConversation.id] || []);
    } else {
      setCurrentConversationMessages([]);
      if (isMobile && currentMobileView === 'chat' && !selectedConversation) {
        setCurrentMobileView('inbox');
      }
    }
  }, [selectedConversation, allConversationsMessages, isMobile, currentMobileView]);

  const toggleLeftPanel = () => {
    setIsLeftCollapsed(!isLeftCollapsed);
  };
  const toggleRightPanel = () => {
    setIsRightCollapsed(!isRightCollapsed);
  };

  const handleLeftWidthChange = (newWidth) => {
    setLeftPanelWidth(newWidth);
  };
  const handleRightWidthChange = (newWidth) => {
    setRightPanelWidth(newWidth);
  };

  const handleSendMessage = (msg) => {
    if (!selectedConversation || !selectedConversation.id) {
      console.warn("No conversation selected, cannot send message.");
      return;
    }
    const currentMessagesForConv = allConversationsMessages[selectedConversation.id] || [];
    const newMessage = {
      id: (currentMessagesForConv.length > 0 ? Math.max(...currentMessagesForConv.map(m => m.id)) : 0) + 1,
      sender: 'agent', text: msg, time: 'Just now', seen: false, avatar: 'T'
    };
    setAllConversationsMessages(prevAllMessages => ({
      ...prevAllMessages,
      [selectedConversation.id]: [...currentMessagesForConv, newMessage]
    }));
    setDraftMessage('');
    setDraftSource(null);
  };

  const handleDraftChangeFromInput = (text) => {
    setDraftMessage(text);
    setDraftSource('user');
  };
  const handleComposeMessageFromAI = (text) => {
    setDraftMessage(text);
    setDraftSource('ai');
    if (isMobile) {
        setCurrentMobileView('chat');
    }
    if (typeof document !== 'undefined') {
        setTimeout(() => {
        const inputElement = document.querySelector('.conversation-input textarea');
        if (inputElement) inputElement.focus();
        }, 0);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
   
  };

  const handleSendTextToAIAssistant = (selectedText) => {
    setGloballySelectedTextForAI({ text: selectedText, id: Date.now() });
    if (isMobile) {
        setCurrentMobileView('ai');
    }
  };

  const handleAiAssistantTabChange = (activeTabName) => {
    setIsAiAssistantDetailsTabActive(activeTabName === "Details");
  };

  const MobileNavItem = ({ icon: Icon, label, viewName, currentView, onClick, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center h-full px-2 transition-colors basis-1/3
                  ${currentView === viewName
                    ? (theme === 'dark' ? 'text-white' : 'text-purple-600')
                    : (theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-700')}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon size={20} strokeWidth={currentView === viewName ? 2.5 : 2} />
      <span className={`mt-0.5 text-[10px] font-medium ${currentView === viewName ? 'font-semibold' : ''}`}>{label}</span>
    </button>
  );

  return (
    <div className={`h-screen overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'} ${isMobile ? 'pb-16' : ''}`}>

      {!isMobile && isLeftCollapsed && (
        <button
          onClick={toggleLeftPanel}
          className="fixed left-1 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full shadow-lg
                     bg-white text-gray-600 hover:bg-gray-100
                     dark:bg-white dark:text-black dark:hover:bg-opacity-80
                     transition-colors"
          aria-label="Open left panel">
          <ChevronRight size={20} />
        </button>
      )}
      {!isMobile && isRightCollapsed && (
        <button
          onClick={toggleRightPanel}
          className="fixed right-1 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full shadow-lg
                     bg-white text-gray-600 hover:bg-gray-100
                     dark:bg-white dark:text-black dark:hover:bg-opacity-80
                     transition-colors"
          aria-label="Open right panel">
          <ChevronLeft size={20} />
        </button>
      )}

    <div className="flex h-full w-full">
      {!isMobile ? (
        <>
            {/* DESKTOP LEFT PANEL */}
            {!isLeftCollapsed && (
                <ResizablePanel
                    defaultWidth={leftPanelWidth}
                    minWidth={50}
                    maxWidth={600}
                    isResizable={true}
                    onWidthChange={handleLeftWidthChange}
                    position="right"
                    className={`h-full bg-white dark:bg-black border-r border-gray-200 dark:border-white/20 transition-all duration-200 ease-in-out`}
                    theme={theme}
                >
                    <InboxSidebar
                        onSelectConversation={handleSelectConversation}
                        theme={theme}
                        isMobile={isMobile} 
                        setCurrentMobileView={setCurrentMobileView} 
                    />
                </ResizablePanel>
            )}

          
            <div className="flex-1 h-full overflow-hidden flex flex-col min-w-0">
                <ConversationArea
                    conversation={selectedConversation}
                    messages={currentConversationMessages}
                    draftMessage={draftMessage}
                    setDraftMessage={handleDraftChangeFromInput}
                    onSendMessage={handleSendMessage}
                    draftSource={draftSource}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    onSendTextToAIFromGlobal={handleSendTextToAIAssistant}
                    isAiAssistantDetailsTabActive={isAiAssistantDetailsTabActive}
                    isMobileView={false}
                />
            </div>

          
            {!isRightCollapsed && (
                 <ResizablePanel
                    defaultWidth={rightPanelWidth}
                    minWidth={50}
                    maxWidth={600}
                    isResizable={true}
                    onWidthChange={handleRightWidthChange}
                    position="left"
                    className={`h-full bg-white dark:bg-black border-l border-gray-200 dark:border-white/20 transition-all duration-200 ease-in-out`}
                    theme={theme}
                >
                    <AIAssistant
                        conversationContext={selectedConversation}
                        mainChatHistory={currentConversationMessages}
                        onComposeMessage={handleComposeMessageFromAI}
                        theme={theme}
                        globallySelectedTextData={globallySelectedTextForAI}
                        onTabChange={handleAiAssistantTabChange}
                    />
                </ResizablePanel>
            )}
        </>
      ) : (
        <>
           
            {currentMobileView === 'inbox' && (
                <div className="fixed inset-0 z-10 bg-white dark:bg-black h-full w-full">
                    <InboxSidebar
                        onSelectConversation={handleSelectConversation}
                        theme={theme}
                        isMobile={isMobile}
                        setCurrentMobileView={setCurrentMobileView} 
                    />
                </div>
            )}
            {currentMobileView === 'chat' && (
                <div className="fixed inset-0 z-10 bg-white dark:bg-black h-full w-full">
                    <ConversationArea
                        conversation={selectedConversation}
                        messages={currentConversationMessages}
                        draftMessage={draftMessage}
                        setDraftMessage={handleDraftChangeFromInput}
                        onSendMessage={handleSendMessage}
                        draftSource={draftSource}
                        theme={theme}
                        toggleTheme={toggleTheme}
                        onSendTextToAIFromGlobal={handleSendTextToAIAssistant}
                        isAiAssistantDetailsTabActive={isAiAssistantDetailsTabActive}
                        isMobileView={true}
                        onMobileNavToInbox={() => setCurrentMobileView('inbox')}
                        onMobileNavToAI={() => setCurrentMobileView('ai')}
                    />
                </div>
            )}
            {currentMobileView === 'ai' && (
                <div className="fixed inset-0 z-10 bg-white dark:bg-black h-full w-full">
                    <AIAssistant
                        conversationContext={selectedConversation}
                        mainChatHistory={currentConversationMessages}
                        onComposeMessage={handleComposeMessageFromAI}
                        theme={theme}
                        globallySelectedTextData={globallySelectedTextForAI}
                        onTabChange={handleAiAssistantTabChange}
                    />
                </div>
            )}
        </>
      )}
    </div>


      {isMobile && (
        <div className={`fixed bottom-0 left-0 right-0 h-16 border-t flex justify-around items-stretch z-30
                        ${theme === 'dark' ? 'bg-black border-white/20' : 'bg-white border-gray-200'}`}>
          <MobileNavItem icon={Inbox} label="Inbox" viewName="inbox" currentView={currentMobileView} onClick={() => setCurrentMobileView('inbox')} />
          <MobileNavItem icon={MessageCircle} label="Chat" viewName="chat" currentView={currentMobileView} onClick={() => setCurrentMobileView('chat')} disabled={!selectedConversation && currentMobileView !== 'chat'} />
          <MobileNavItem icon={BrainCircuit} label="Copilot" viewName="ai" currentView={currentMobileView} onClick={() => setCurrentMobileView('ai')} />
        </div>
      )}
    </div>
  );
}