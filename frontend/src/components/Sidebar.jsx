import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, MessageCircleMore } from "lucide-react";
import { useSocketStore } from "../store/useSocketStore";
import { useQuery } from "@tanstack/react-query";


const Sidebar = () => {
  const { selectedUser, getUsers, setSelectedUser } = useChatStore();

  const { onlineUsers, isTyping } = useSocketStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    const {
    data: users,
    isLoading,
    isError,
    error } = useQuery({
      queryKey: ['users'],
      queryFn: getUsers,
      staleTime: 1000 * 60 * 5,
    });


  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isLoading) return <SidebarSkeleton />;

  return (
  <aside className={`flex flex-row sm:flex-col h-20 sm:h-full w-full sm:w-20 lg:w-72 sm:border-r border-base-300 transition-all duration-200 ${selectedUser ? 'hidden sm:flex' : 'flex'}`}>
    {/* Header / Filters */}
    <div className="border-b border-base-300 sm:w-auto p-5 sm:border-0 lg:border-0">
      <div className="flex items-center">
        <Users className="size-8" />
        <span className="font-small hidden lg:block">Contacts</span>
      </div>
      <div className="mt-3 hidden lg:flex items-center gap-2">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm">Show online only</span>
        </label>
        <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
      </div>
    </div>

    {/* Users list */}
    <div className="flex border-b border-base-300 flex-row w-full sm:w-auto p-2 sm:flex-col sm:border-0 lg:flex-col">
      {filteredUsers.map((user) => (
        <button
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className={`
            flex items-center gap-3 p-3
            w-auto sm:w-full lg:w-full
            hover:bg-base-300 transition-colors
            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
        >
          <div className="relative mx-auto sm:mx-0">
            <img
              src={user.profilePic || "./user-avatar.png"}
              alt={user.name}
              className="w-10 h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
            />
            {onlineUsers.includes(user._id) && (
              isTyping
                ? <MessageCircleMore className="absolute bottom-0 right-0 w-5 h-5 bg-black-500" />
                : <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
            )}
          </div>

          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{user.fullName}</div>
            <div className="text-sm text-zinc-400">
              {onlineUsers.includes(user._id) ? "Online" : "Offline"}
            </div>
          </div>
        </button>
      ))}

      {filteredUsers.length === 0 && (
        <div className="text-center text-zinc-500 py-4">No online users</div>
      )}
    </div>
  </aside>
  );
};
export default Sidebar;