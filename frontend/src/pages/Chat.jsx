
import Sidebar from "../components/Sidebar";
import MSidebar from "../components/MobileSidebar";
import NoChatSelected from "../components/NoChatContainer";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/chat.store";


const HomePage = () => {
  const { selectedUser } = useChatStore();
  

  return (
    <div className="bg-base-200">
      

      <div className="bg-base-100 h-[calc(100vh-4rem)] md:h-[100vh]">
        <div className="flex h-full motion-preset-blur-right motion-duration-300 overflow-hidden relative">
          
          

          
          <Sidebar />

          
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
