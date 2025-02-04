import {UserData} from "@/interfaces/UserData";
import React from "react";


interface UserCardProps {
    user: UserData;
    children?: React.ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ user, children }) => {
    return (
        <div className="card min-w-96 bg-accent shadow-xl my-3">
            <div className="card-body">
                <h2 className="card-title">{user.name}</h2>
                <p>{user.email}</p>
                <p>Roles: {user.roles.join(', ')}</p>
                {user.boards &&
                <p>Boards: {user.boards.join(', ')}</p>
                }
                {children}
            </div>
        </div>
    );
};

export default UserCard;
