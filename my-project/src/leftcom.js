
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronDown,
  MessageSquare,
  CornerUpLeft,
} from 'lucide-react';

const ThreeQuarterCircleIcon = ({ size = 12, className = '', theme = 'light' }) => {
  const r = 12;
  const c = 12;
  const quadrantPath = `M ${c},${c} L 0,${c} A ${r},${r} 0 0 1 ${c},0 Z`;

  const mainFill = "currentColor";
  const pathFill = theme === 'dark' ? 'black' : 'lightgray'; 

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx={c} cy={c} r={r} fill={mainFill} />
      <path d={quadrantPath} fill={pathFill} />
    </svg>
  );
};


export function ResizablePanel({
  children,
  defaultWidth,
  minWidth = 50,
  maxWidth = 800,
  isResizable = true,
  onWidthChange,
  className = '',
  position,
  theme 
}) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  useEffect(() => {
      setWidth(defaultWidth);
  }, [defaultWidth]);

  const resize = useCallback((e) => {
    if (!isResizing) return;
    let delta;
    if (position === 'right') {
      delta = e.clientX - startXRef.current;
    } else {
      delta = startXRef.current - e.clientX;
    }
    let newWidth = startWidthRef.current + delta;

    if (typeof newWidth !== 'number' || isNaN(newWidth)) return;
    const numMinWidth = typeof minWidth === 'number' ? minWidth : 0;
    const numMaxWidth = typeof maxWidth === 'number' ? maxWidth : Infinity;

    newWidth = Math.max(numMinWidth, Math.min(numMaxWidth, newWidth));


    if (newWidth !== width) {
      setWidth(newWidth);
      if (onWidthChange) {
        onWidthChange(newWidth);
      }
    }
  }, [isResizing, position, minWidth, maxWidth, onWidthChange, width]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    if (typeof document !== 'undefined') {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResizing);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }
  }, [resize]);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = panelRef.current ? panelRef.current.offsetWidth : (typeof width === 'number' ? width : 300);
    if (typeof document !== 'undefined') {
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }
  }, [width, resize, stopResizing]);

  useEffect(() => {
    return () => {
      if (isResizing && typeof document !== 'undefined') {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResizing);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [isResizing, resize, stopResizing]);


  return (
    <div
      ref={panelRef}
      className={`relative h-full ${className}`}
      style={{
        minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        width: typeof width === 'number' ? `${width}px` : width,
        flexShrink: 0,
        overflow: 'hidden',
        transition: isResizing ? 'none' : 'width 0.2s ease-in-out',
      }}
    >
      {(typeof width === 'string' || (typeof width === 'number' && width > 0)) && children}
      {isResizable && (typeof width === 'number' && width > 0) && (
        <div
          className={`absolute ${
            position === 'right' ? 'right-0 -mr-1' : 'left-0 -ml-1'
          } top-0 w-2 h-full cursor-col-resize z-10 group hidden md:block`}
          onMouseDown={startResizing}
          role="separator"
          aria-label={`Resize panel ${position === 'left' ? 'from left' : 'from right'}`}
        >
          <div className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full
                           ${theme === 'dark'
                             ? 'bg-white/30 group-hover:bg-white'
                             : 'bg-gray-300 group-hover:bg-purple-600'}
                           transition-colors`} />
        </div>
      )}
    </div>
  );
}

const initialConversationsData = [
  { id: 1, type: 'initial', avatarChar: 'L', avatarColorClass: 'bg-indigo-300', avatarTextColorClass: 'text-white', name: 'Luis', source: 'Github', line2: 'Hey! I have a questio...', time: '45m', isUnread: true },
  { id: 2, type: 'initial', avatarChar: 'I', avatarColorClass: 'bg-pink-500', avatarTextColorClass: 'text-white', name: 'Ivan', source: 'Nike', line2: 'Hi there, I have a qu...', time: '30m', isUnread: false, priority: true, priorityTime: '3min' },
  { id: 3, type: 'initial', avatarChar: 'L', avatarColorClass: 'bg-indigo-300', avatarTextColorClass: 'text-white', name: 'Lead from New York', line2: 'Good morning, let me...', time: '40m', isUnread: true, assigneeAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80' },
  { id: 4, type: 'icon', iconComponent: MessageSquare, avatarColorClass: 'bg-black', avatarTextColorClass: 'text-white', name: 'Booking API problems', line2: 'Bug report', line3: 'Luis · Small Crafts', time: '45m', isUnread: false },
  { id: 5, type: 'icon', iconComponent: CornerUpLeft, avatarColorClass: 'bg-gray-400', avatarTextColorClass: 'text-white', name: 'Miracle', source: 'Exemplary Bank', line2: 'Hey there, I\'m here to...', time: '45m', isUnread: false },
];

export function InboxSidebar({ onSelectConversation, theme, isMobile, setCurrentMobileView }) {
  const [filterOpen] = useState(initialConversationsData.length); 
  const [sortBy] = useState('Waiting longest');
  const [conversations, setConversations] = useState(initialConversationsData);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  useEffect(() => {
    if (conversations.length > 0 && selectedConversationId === null) {
      const firstConv = conversations[0];
      setSelectedConversationId(firstConv.id);
      if (onSelectConversation && typeof onSelectConversation === 'function') {
        onSelectConversation(firstConv);
      }
    }
  }, [conversations, selectedConversationId, onSelectConversation]);

  const handleSelect = (conv) => {
    setSelectedConversationId(conv.id);
    if (onSelectConversation && typeof onSelectConversation === 'function') {
        onSelectConversation(conv);
    }
    
    if (isMobile && setCurrentMobileView && typeof setCurrentMobileView === 'function') {
        setCurrentMobileView('chat');
    }
  };

  const defaultIconSize = 16;

  return (
    <div className="flex flex-col h-full w-full text-gray-900 dark:text-white">
      <div>
        <div className="p-3 sm:p-4 flex items-center justify-between border-b border-gray-200 dark:border-white/20">
          <h1 className="text-lg sm:text-xl font-semibold">Your inbox</h1>
        </div>
        <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between text-xs sm:text-sm text-gray-700 dark:text-white/70">
          <div className="flex items-center cursor-pointer hover:text-purple-600 dark:hover:text-white">
            <span className="font-medium">{filterOpen} Open</span>
            <ChevronDown size={defaultIconSize} className="ml-1" />
          </div>
          <div className="flex items-center cursor-pointer hover:text-purple-600 dark:hover:text-white">
            <span className="font-medium">{sortBy}</span>
            <ChevronDown size={defaultIconSize} className="ml-1" />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-1.5 sm:p-2">
        {conversations.map((conv) => {
          const isSelected = conv.id === selectedConversationId;
          const IconComponent = conv.iconComponent;

          const avatarBaseClasses = "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0";
          
          const avatarClasses = `${avatarBaseClasses} ${conv.avatarColorClass} ${conv.avatarTextColorClass}`;
          

          const itemBaseClasses = "px-2.5 py-2 sm:px-4 sm:py-3 cursor-pointer rounded-lg shadow-sm mb-1.5 sm:mb-2 transition-colors duration-150 ease-in-out";
          const itemLightSelectedClasses = "bg-indigo-100 text-slate-800";
          const itemLightUnselectedClasses = "bg-white hover:bg-gray-50 text-gray-900";
          const itemDarkSelectedClasses = "bg-purple-500 text-white"; 
          const itemDarkUnselectedClasses = "bg-black hover:bg-white/10 text-white";

          const itemClasses = `${itemBaseClasses} ${
            theme === 'dark'
              ? (isSelected ? itemDarkSelectedClasses : itemDarkUnselectedClasses)
              : (isSelected ? itemLightSelectedClasses : itemLightUnselectedClasses)
          }`;

          const textPrimaryClasses = theme === 'dark'
            ? (isSelected ? 'text-white' : 'text-white') 
            : (isSelected ? 'text-slate-800' : 'text-gray-900');

          const textSecondaryClasses = theme === 'dark'
            ? (isSelected ? 'text-white/80' : 'text-white/70')
            : (isSelected ? 'text-slate-600' : 'text-gray-600');

          const sourceTextClasses = theme === 'dark'
            ? (isSelected ? 'text-white/70' : 'text-white/60')
            : (isSelected ? 'text-slate-500' : 'text-gray-500');

          const priorityBadgeBase = "flex items-center rounded px-1 py-0.5 sm:px-1.5";
          const priorityBadgeLight = "bg-yellow-100 text-yellow-800";
          const priorityBadgeDark = "bg-yellow-400 text-yellow-900"; 
          const priorityBadgeClasses = `${priorityBadgeBase} ${theme === 'dark' ? priorityBadgeDark : priorityBadgeLight}`;

          const avatarIconSize = conv.type === 'icon' ? defaultIconSize : 16;

          return (
            <div
              key={conv.id}
              className={itemClasses}
              onClick={() => handleSelect(conv)}
            >
              <div className="flex items-start">
                <div className={avatarClasses}>
                  {conv.type === 'initial' && conv.avatarChar && (
                    <span className="text-xs sm:text-sm">{conv.avatarChar}</span>
                  )}
                  {conv.type === 'icon' && IconComponent && (
                    <IconComponent size={avatarIconSize} strokeWidth={2.5} />
                  )}
                </div>

                <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                  <div className="flex items-baseline">
                    <span className={`text-xs sm:text-sm font-semibold truncate ${textPrimaryClasses}`}>
                      {conv.name}
                    </span>
                    {conv.source && (
                      <span className={`ml-1 text-xs truncate shrink-0 ${sourceTextClasses}`}>
                        · {conv.source}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm truncate ${textSecondaryClasses}`}>
                    {conv.line2}
                  </p>
                  {conv.line3 && (
                    <p className={`text-xs sm:text-sm truncate ${textSecondaryClasses}`}>
                      {conv.line3}
                    </p>
                  )}
                </div>

                <div className="ml-1.5 sm:ml-2 shrink-0 text-xs flex flex-col justify-between h-full" style={{ minHeight: '2.5rem' }}>
                  <div className="h-5 flex justify-end items-start">
                    {conv.assigneeAvatarUrl && !conv.priority && (
                      <img src={conv.assigneeAvatarUrl} alt="Assignee" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" />
                    )}
                    {conv.priority && (
                        <div className={priorityBadgeClasses}>
                            <ThreeQuarterCircleIcon size={10} className="mr-0.5" theme={theme} />
                            <span className={`font-medium text-[10px] sm:text-xs`}>
                                {conv.priorityTime}
                            </span>
                        </div>
                    )}
                  </div>
                  <div className={`self-end text-right ${textSecondaryClasses} text-[10px] sm:text-xs`}>
                    <span>
                        {conv.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}