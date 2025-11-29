import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios.js"; // Ensure your API client is imported

const getMessages = async (userId) => {
    if (!userId){
        return [];
    }

    const res = await api.get(`/message/${userId}`);
    return res.data;
};

const getUsers = async () => {
    const res = await api.get("/message/users");
    return res.data;
};

const Dev = () => {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const messagesEndRef = useRef(null);

    const {data: users = []} = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
        staleTime: 1000* 60 * 5
    });

    const {data: messages = []} = useQuery({
        queryKey: ['messages', selectedUserId],
        queryFn: () => getMessages(selectedUserId),
        enabled: !!selectedUserId,
        staleTime: 1000* 60 * 50
    });

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    console.log(messages)


    return(
        <div className="flex flex-col mt-20 p-5 bg-[#424549]">
            <h1 className="">React Query Testing Grounds</h1>
            {/*User*/}
            <div className="flex">
                {users.map((user) => {
                    return(
                        <button key={user._id} onClick={() => {setSelectedUserId(user._id)}} className="m-2">
                            <img className ="w-16 h-16 rounded-full border-2" 
                                src={user.profilePic || "./user-avatar.png"} 
                                alt=""/>
                        </button>
                    )
                 })}
            </div>

            {/*Messages*/}
            <div className="flex-1 flex flex-col p-4">
                <h2 className="text-white mb-4">Messages</h2>
                <div className="flex-1 overflow-y-auto bg-gray-900 p-4 rounded-lg flex flex-col gap-2">
                    {messages.map((message) => (
                            <div
                            key={message._id}
                            className={`chat ${
                                message.senderId === (selectedUserId)
                                ? "chat-end"
                                : "chat-start"
                            }`}
                            ref={messagesEndRef}
                            >
                            {/* Avatar */}
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                <img
                                    src={
                                    message.senderId === (selectedUserId)
                                        ? (selectedUserId.profilePic || selectedUserId.userData?.profilePic) || "./user-avatar.png"
                                        : (selectedUserId.profilePic || selectedUserId.userData?.profilePic) || "./user-avatar.png"
                                    }
                                    alt="profile pic"
                                />
                                </div>
                            </div>

                            {/* Message */}
                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                            </div>
                        ))}
                <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    )
}

export default Dev;