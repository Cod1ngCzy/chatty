import { Users, Image, Film, Music, File, Bell, Lock, Palette, Shield, ArrowLeftFromLine} from 'lucide-react';
import { useState } from 'react';
import { useChatStore } from '../store/useChatStore';

const ChatSettings = () => {
    const [viewImages, setViewImages] = useState(false);
    const {messages, selectedUser} = useChatStore();
    const images = messages.filter(message => message.image).map(message => message.image); 
    
    const handleViewImages = () => {
        setViewImages(!viewImages);
    }

    if(!viewImages){
        return(
            <div className="flex flex-col">
                {/* User Icon */}
                <div className="flex flex-col items-center justify-center mb-5">
                    <button className="m-5 self-start" onClick={() => {useChatStore.setState({isShowSettings: false})}}>
                        <ArrowLeftFromLine className="cursor-pointer size-5 md:size-auto"/>
                    </button>
                    <div className="avatar p-2">
                        <div className="size-20 rounded-full relative sm:50">
                            <img src={selectedUser.profilePic || "/user-avatar.png"} alt={selectedUser.fullName} />
                        </div>
                    </div>
                    <h1 className="font-extrabold text-white text-sm sm:text-lg">{selectedUser.fullName}</h1>
                </div>

                {/* Chat Info */}
                <div className="flex flex-col justify-center w-full">
                    <h1 className="text-white ml-4 text-sm sm:text-lg">Media, Files, and Links</h1>
                    <div className="w-full p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-700">Recent Media</h3>
                            <button className="text-sm text-blue-500 hover:text-blue-600" onClick={handleViewImages}>View All</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
                            {images && images.length > 0 ? (
                                images.slice(0,6).map((image, index) => (
                                    <div key={index} className="aspect-square bg-linear-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden hover:opacity-75 transition cursor-pointer">
                                        <img src={image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))
                            ) : (
                                <div className="aspect-square bg-linear-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                    <Image className="w-6 h-6 text-gray-500" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    } else if (viewImages) {
        return(
            <div className="flex flex-col p-2">
                <button className="flex flex-row m-5 self-start" onClick={() => {handleViewImages()}}>
                        <ArrowLeftFromLine className="cursor-pointer size-5 md:size-auto"/>
                        <h1 className="ml-2 text-gray-400">Return</h1>
                </button>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
                    {images && images.length > 0 ? (
                        images.map((image, index) => (
                            <div key={index} className="aspect-square bg-linear-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden hover:opacity-75 transition cursor-pointer">
                                <img src={image} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))
                    ) : (
                        <div className="aspect-square bg-linear-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                            <Image className="w-6 h-6 text-gray-500" />
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default ChatSettings;