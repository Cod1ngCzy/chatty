const UserCard = ({user, selected, onClick}) => {
    return(
    <div onClick={onClick} className={`p-3 m-1 ${selected ? 'bg-blue-950' : 'bg-none'} rounded hover:bg-gray-600 cursor-pointer`}>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
            <div>
                <div className="font-medium text-white">{user.fullName}</div>
                <div className="text-sm text-gray-400">Online</div>
            </div>
        </div>
    </div>
    )
}

export default UserCard;