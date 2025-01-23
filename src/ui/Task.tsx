import React, { useState, useEffect } from "react";
import axios from '@/lib/axios';
import { TaskData } from "@/interfaces/TaskData";

interface TaskProps {
    task: TaskData;
    statuses: { id: string, name: string }[];
}

const Task: React.FC<TaskProps> = ({ task, statuses }) => {
    const { id, title, content, statusId, dueDate, priority, slug, assigneeName, creatorName } = task;
    const [currentStatus, setCurrentStatus] = useState(statusId);

    useEffect(() => {
        setCurrentStatus(statusId);
    }, [statusId]);

    const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatusId: number = parseInt(event.target.value, 10);
        try {
            await axios.put(`/api/task/${id}`, { status_id: newStatusId });
        } catch (error) {
            console.error("Failed to update status", error);
        }
        setCurrentStatus(newStatusId.toString());
    };

    return (
        <div className="card bg-base-300 shadow-xl w-2/5">
            <div className="card-body flex-row">
                <div className="">
                    <h2 className="card-title"><div className="text-primary">{slug}</div>{title}</h2>
                    <p className="text-base-content pr-2">{content}</p>
                </div>
                <div className="min-w-40 space-y-1">
                    <p className="text-sm text-gray-500 ">Status:
                        <select className="badge badge-primary cursor-pointer px-1" value={currentStatus} onChange={handleStatusChange} >
                            {statuses.map((status) => (
                                <option key={status.id} value={parseInt(status.id, 10)}>{status.name}</option>
                            ))}
                        </select>
                    </p>
                    {dueDate && <p className="text-sm text-gray-500">Due Date: <span className="badge badge-accent">{dueDate}</span></p>}
                    {priority && <p className="text-sm text-gray-500">Priority: <span className="badge badge-accent">{priority}</span></p>}
                    <p className="text-sm text-gray-500">Creator: <span className="badge badge-primary">{creatorName}</span></p>
                    {assigneeName && <p className="text-sm text-gray-500">Assignee: <span className="badge badge-primary">{assigneeName}</span></p>}
                </div>
            </div>
        </div>
    );
};

export default Task;
