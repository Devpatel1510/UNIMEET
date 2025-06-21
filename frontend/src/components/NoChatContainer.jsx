import React,{useState} from 'react';
import { MessageSquare } from 'lucide-react'
import MSidebar from './MobileSidebar'; // Optional icon for better visual

function NoChatSelected() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex-1 w-full bg-gradient-to-br from-blue-50 to-white">
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 sm:py-32 md:py-40 lg:py-60 w-full h-full">
        <div className="flex flex-col items-center space-y-4">
          <MessageSquare className="w-12 h-12 text-blue-500" />
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700">
            No Chat Selected
          </h2>
          <p className="text-gray-600 max-w-md">
            Please select a conversation from the sidebar to start chatting.
          </p>
          <button className="md:hidden mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition-colors" onClick={() => setIsSidebarOpen(true)}>Select Chat</button>
          
        </div>
        <MSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </section>
    </div>
  );
}

export default NoChatSelected;
