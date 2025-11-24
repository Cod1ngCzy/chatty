import { ArrowLeftFromLine, CircleAlert } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../store/useSocketStore";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isShowSettings} = useChatStore();
  const { onlineUsers } = useSocketStore();

  const handleChatSettings = () => {
    useChatStore.setState({isShowSettings: !isShowSettings});
  }

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/user-avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <div className="flex justify-around">
          <button className="m-1" onClick={() => setSelectedUser(null)}>
            <ArrowLeftFromLine className="cursor-pointer"/>
          </button>
          <button className="m-1" onClick={() => handleChatSettings()}>
            <CircleAlert className="cursor-pointer"/>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;