import React, { useState, useEffect } from "react";
import axios from '@/lib/axios';
import { TaskData } from '@/interfaces/TaskData';

interface TaskProps {
    task: TaskData;
    statuses: { id: string, name: string }[];
    users: { id: string, name: string }[];
    priorities: { id: string, name: string }[];
}

const Task: React.FC<TaskProps> = ({ task, statuses, users, priorities }) => {
    const { id, title, content, statusId, dueDate, priorityId, slug, assigneeId, creatorName } = task;
    const [currentStatus, setCurrentStatus] = useState<string>(statusId || '');
    const [currentUser, setCurrentUser] = useState<string>(assigneeId || '');
    const [currentPriority, setCurrentPriority] = useState<string>(priorityId || '');

    useEffect(() => {
        setCurrentStatus(statusId || '');
        setCurrentUser(assigneeId || '');
        setCurrentPriority(priorityId || '');
    }, [statusId, assigneeId, priorityId]);

    const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatusId: number = parseInt(event.target.value, 10);
        try {
            await axios.put(`/api/task/${id}`, { status_id: newStatusId });
        } catch (error) {
            console.error("Failed to update status", error);
        }
        setCurrentStatus(newStatusId.toString());
    };

    const handleUserChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newUserId: string = event.target.value;
        try {
            await axios.put(`/api/task/${id}`, { assignee_id: newUserId });
        } catch (error) {
            console.error("Failed to update user", error);
        }
        setCurrentUser(newUserId);
    };

    const handlePriorityChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPriorityId: string = event.target.value;
        try {
            await axios.put(`/api/task/${id}`, { priority_id: newPriorityId });
        } catch (error) {
            console.error("Failed to update priority", error);
        }
        setCurrentPriority(newPriorityId);
    };

    return (
        <div className="card bg-base-300 shadow-xl max-w-min">
            <div className="card-body flex-row">
                <div className="min-w-96">
                    <h2 className="card-title"><div className="text-primary">{slug}</div>{title}</h2>
                    <p className="text-base-content pr-2">{content || '-'}</p>
                </div>
                <div className="min-w-60 max-w-96 space-y-1 ml-10">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <tbody>
                            <tr>
                                <th colSpan={2} className="text-center">Task Details</th>
                            </tr>
                            <tr className="">
                                <td>Status</td>
                                <td>
                                    <select className="badge badge-primary cursor-pointer px-1" value={currentStatus}
                                            onChange={handleStatusChange}>
                                        {statuses.map((status) => (
                                            <option key={status.id}
                                                    value={parseInt(status.id, 10)}>{status.name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr className="bg-base-200">
                                <td>Due Date</td>
                                <td>{dueDate || '-'}</td>
                            </tr>
                            <tr>
                                <td>Priority</td>
                                <td>
                                    <select className="badge badge-error cursor-pointer px-1" value={currentPriority}
                                            onChange={handlePriorityChange}>
                                        {priorities.map((priority) => (
                                            <option key={priority.id} value={priority.id}>{priority.name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr className="bg-base-200">
                                <td>Creator</td>
                                <td>{creatorName || '-'}</td>
                            </tr>
                            <tr>
                                <td>Assignee</td>
                                <td>
                                    <select className="badge badge-accent cursor-pointer px-1 max-w-24 overflow-ellipsis" value={currentUser}
                                            onChange={handleUserChange}>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Task;
