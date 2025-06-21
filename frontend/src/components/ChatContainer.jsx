import React, { useEffect, useRef, useState } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import { useChatStore } from '../store/chat.store'
import { formatMessageTime } from "../lib/utils";
import { useauthstore } from '../store/auth.store';


import toast from 'react-hot-toast';



function ChatContainer() {
    const {messages, getMessages, selectedUser, isMessagesLoading} = useChatStore();
    const {authUser} = useauthstore();
    const messageEndRef = useRef(null);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const messagesContainerRef = useRef(null);
    const lastMessageIdRef = useRef(null);

    useEffect(() => {
    if (!authUser || !messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    const isFromOtherUser = lastMessage.senderId !== authUser._id;
    const isNew = lastMessage._id !== lastMessageIdRef.current;

    if (isNew) {
        lastMessageIdRef.current = lastMessage._id;

        if (isFromOtherUser) {
            const container = messagesContainerRef.current;
            const isAtBottom =
                container &&
                container.scrollTop + container.clientHeight >= container.scrollHeight - 100;

            if (!isAtBottom) {
                
                toast("📩 New message received!");
            }
        }
    }
}, [messages, authUser]);


   


    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
        }
    }, [getMessages, selectedUser?._id])

    useEffect(() => {
        const checkScroll = () => {
            if (messagesContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
                setShowScrollIndicator(scrollTop + clientHeight < scrollHeight - 100);
            }
        };
        
        const container = messagesContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            checkScroll(); 
            
            return () => container.removeEventListener('scroll', checkScroll);
        }
    }, [messages]);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col" >
                <ChatHeader />
                <div className="flex-1 overflow-y-auto p-4">
                    
                </div>
                <MessageInput />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col md:flex relative  bg-blue-50" >
            <ChatHeader />
            

            <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4  scrollbar-hide space-y-3"
            >
                {messages?.map((message) => (
                    <div
                        key={message._id}
                        className={`flex ${message.senderId === authUser?._id ? "justify-end" : "justify-start"}`}
                    >

                        
                        <div className={`flex max-w-[80%] ${message.senderId === authUser?._id ? "flex-row-reverse" : "flex-row"} gap-2`}>
                            <div className="flex-shrink-0">
                                <img
                                    src={
                                        message.senderId === authUser?._id
                                            ? authUser?.profilePic || "/display-pic (1).png"
                                            : selectedUser?.profilePic || "/display-pic (1).png"
                                    }
                                    alt="Profile"
                                    className="size-10 rounded-full border border-gray-300"
                                />
                            </div>

                            <div className={`flex flex-col ${message.senderId === authUser?._id ? "items-end" : "items-start"}`}>
                                <div className="text-xs text-gray-500 mb-1">
                                    {formatMessageTime(message.createdAt)}
                                </div>

                                <div
                                    className={`rounded-lg px-4 py-2 ${
                                        message.senderId === authUser?._id
                                            ? "bg-white text-gray-800"
                                            : "bg-white text-gray-800"
                                    }`}
                                >
                                    {message.image && (
                                        <img
                                            src={message.image}
                                            alt="Attachment"
                                            className="max-w-full max-h-60 rounded-md mb-2 object-cover"
                                        />
                                    )}
                                    
                                    {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {showScrollIndicator && (
                <button 
                    onClick={scrollToBottom}
                    className="absolute bottom-20 right-6  "
                    style={{ right: '372px' }}
                    aria-label="Scroll to bottom"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6 text-blue-500 animate-bounce" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                        />
                    </svg>
                </button>
            )}

            <MessageInput />
        </div>
    )
}

export default ChatContainer
