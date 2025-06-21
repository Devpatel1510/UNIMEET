import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chat.store';
import { useauthstore } from '../store/auth.store';
import { X } from 'lucide-react';

function ChatHeader() {
  const {
    selectedUser,
    setSelectedUser,
    getMessages,
    messages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  
  const { onlineUsers } = useauthstore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  
  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-300  border-b border-blue-300 bg-blue-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                className="size-10 rounded-full relative"
                src={selectedUser?.profilePic || "/display-pic (1).png"}
                alt={selectedUser?.email || "User"}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser?.firstName ? selectedUser?.firstName : selectedUser?.email }</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        

        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
