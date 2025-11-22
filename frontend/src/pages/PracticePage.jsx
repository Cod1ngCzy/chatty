import { useState } from "react";
import UserCard from "../components/UserCard.jsx";

const PracticePage = () => {
    const messages = [
        { _id: '1', senderId: 'user123', text: 'Hey there!', timestamp: '10:30 AM' },
        { _id: '2', senderId: 'currentUser', text: 'Hi! How are you?', timestamp: '10:31 AM' },
        { _id: '3', senderId: 'user123', text: 'I am good, thanks!', timestamp: '10:32 AM' },
        { _id: '4', senderId: 'currentUser', text: 'Great to hear!', timestamp: '10:33 AM' },
    ];

    const users = [
        { _id: 'user123', fullName: 'John Doe', profilePic: '👨', status: 'online' },
        { _id: 'user456', fullName: 'Jane Smith', profilePic: '👩', status: 'offline' },
        { _id: 'user789', fullName: 'Bob Wilson', profilePic: '👨‍💼', status: 'online' },
    ];

    const currentUser = 'currentUser';
    const [selectedUser, setSelectedUser] = useState(users[0]);


    return(
       <div className="flex h-screen bg-gray-900 p-4 gap-4">
            {/* SideBar */}
            <div className="w-64 bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Users</h2>
                {users.map((user) => (<UserCard key={user._id} user={user} selected={selectedUser._id === user._id} onClick={() => setSelectedUser(user)} />))}
            </div>

            {/* ChatBar */}
            <div className="flex-1 bg-gray-700 rounded-lg">
            {messages.map((message) => {
                const selectedUserMessages = message.senderId === currentUser

                return(
                    <div className="">{message.text}</div>
                )
            })};
            </div>
       </div>
    )
};

export default PracticePage;