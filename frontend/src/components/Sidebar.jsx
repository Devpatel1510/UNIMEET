import { useEffect, useState } from "react";
import { useChatStore } from "../store/chat.store";
import { useauthstore } from "../store/auth.store";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useauthstore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
   const currentUser = useauthstore(state => state.user);
  const onlineCount = onlineUsers.filter(id => id !== currentUser?._id).length-1;

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  return (
    <aside className="hidden md:flex flex-col w-auto bg-blue-600 text-white border-r border-blue-700">
      
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            <span className="ml-2 text-sm font-medium">Online only</span>
          </label>
          <span className="text-xs ">
            ({onlineCount} online{currentUser ? ' (excluding you)' : ''})
          </span>
        </div>
      </div>

      
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isActive = selectedUser?._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all
                ${isActive ? "bg-blue-500 ring-2 ring-white" : "hover:bg-blue-500/60"}
              `}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/display-pic (1).png"}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-blue-600 rounded-full" />
                )}
              </div>

              <div className="flex flex-col text-left min-w-0 hidden lg:block">
                <span className="font-medium truncate">{user.firstName ? user.firstName : user.email}</span>
                <br></br>
                <span className="text-sm text-zinc-300">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-300 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
