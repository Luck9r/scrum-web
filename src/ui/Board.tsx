import React, { useState } from "react";
import TaskCard from "@/ui/TaskCard";
import { TaskData } from "@/interfaces/TaskData";
import Link from "next/link";
import { BsCheckLg, BsFillPencilFill } from "react-icons/bs";
import { useAuth } from '@/hooks/auth';

interface BoardProps {
    id: string | Array<string> | undefined;
    statuses: string[];
    tasks: TaskData[] | undefined;
    name: string;
}

const Board: React.FC<BoardProps> = ({ statuses, tasks, name }) => {
    const { user } = useAuth({ middleware: 'auth' });
    const [editMode, setEditMode] = useState(false);
    const [boardName, setBoardName] = useState(name);
    const [boardStatuses, setBoardStatuses] = useState(statuses);

    const allowedRoles = ['admin', 'product_owner', 'scrum_master'];
    const canEdit = user && user.roles.some((role: { name: string }) => allowedRoles.includes(role.name));

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBoardName(e.target.value);
    };

    const handleStatusChange = (index: number, newStatus: string) => {
        const updatedStatuses = [...boardStatuses];
        updatedStatuses[index] = newStatus;
        setBoardStatuses(updatedStatuses);
    };

    const addStatus = () => {
        setBoardStatuses([...boardStatuses, ""]);
    };

    return (
        <>
            <div className="flex p-4">
                {editMode ? (
                    <input
                        type="text"
                        value={boardName}
                        onChange={handleBoardNameChange}
                        className="input input-bordered"
                    />
                ) : (
                    <h1 className="text-4xl text-primary pb-5">{boardName}</h1>
                )}
                {canEdit && (
                    <div onClick={handleEditToggle} className="cursor-pointer text-primary text-2xl ml-2 pt-2">
                        {editMode ? <BsCheckLg /> : <BsFillPencilFill />}
                    </div>
                )}
            </div>
            <div className="flex space-x-4 pl-4">
                {boardStatuses.map((status, index) => (
                    <div key={index} className="card bg-base-300 min-w-60">
                        <div className="card-body">
                            {editMode ? (
                                <input
                                    type="text"
                                    value={status}
                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                    className="input text-primary"
                                />
                            ) : (
                                <h2 className="card-title text-base-content">{status}</h2>
                            )}
                            {!editMode && (
                                <div className="items-center">
                                    {tasks &&
                                        tasks
                                            .filter((task) => task.status === status)
                                            .map((task) => (
                                                <Link key={task.slug} href={"/task/" + task.slug}>
                                                    <TaskCard task={task}>
                                                        <div className="flex flex-row space-x-2">
                                                            {task.assigneeName && <div className="badge badge-accent">{task.assigneeName}</div>}
                                                            {task.priority && <div className="badge badge-primary">{task.priority}</div>}
                                                        </div>
                                                    </TaskCard>
                                                </Link>
                                            ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {editMode && canEdit && (
                    <button onClick={addStatus} className="btn btn-primary">
                        +
                    </button>
                )}
            </div>
        </>
    );
};

export default Board;
