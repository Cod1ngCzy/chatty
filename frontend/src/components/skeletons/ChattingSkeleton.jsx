import { useChatStore } from "../../store/useChatStore";
import { useSocketStore } from "../../store/useSocketStore";

const ChattingSkeleton = () => {
    const {selectedUser} = useChatStore()
    const {isTyping} = useSocketStore()

    return(
        <div className={isTyping ? 'block' : 'hidden' }>
            <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                    <img
                        src={(selectedUser.profilePic || selectedUser.userData?.profilePic) || "user-avatar.png"}
                        alt="profile pic"
                    />
                </div>
            </div>
            <div className="m-1 badge badge-soft badge-primary">Typing...</div>
        </div>
    );

}

export default ChattingSkeleton;