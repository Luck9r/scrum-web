import React, { useState, useEffect } from "react";
import axios from '@/lib/axios';
import { TaskData } from '@/interfaces/TaskData';
import { BsFillPencilFill, BsCheckLg } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '@/hooks/auth';

interface TaskProps {
    task: TaskData;
    statuses: { id: string, name: string }[];
    users: { id: string, name: string }[];
    priorities: { id: string, name: string }[];
}

const Task: React.FC<TaskProps> = ({ task, statuses, users, priorities }) => {
    const { id, title, content, statusId, dueDate, priorityId, slug, assigneeId, creatorName } = task;
    const { user } = useAuth({ middleware: 'auth' });
    const [currentStatus, setCurrentStatus] = useState<string>(statusId || '');
    const [currentUser, setCurrentUser] = useState<string>(assigneeId || '');
    const [currentPriority, setCurrentPriority] = useState<string>(priorityId || '');
    const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(dueDate ? new Date(dueDate) : null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTitle, setEditedTitle] = useState<string>(title);
    const [editedContent, setEditedContent] = useState<string>(content);

    const allowedRoles = ['admin', 'product_owner', 'scrum_master'];
    const canEdit = user && user.roles.some((role: { name: string }) => allowedRoles.includes(role.name));

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

    const handleDateChange = async (date: Date | null) => {
        setSelectedDate(date);
        setIsDatePickerOpen(false);
        try {
            await axios.put(`/api/task/${id}`, { due_date: date ? formatDate(date) : null });
        } catch (error) {
            console.error("Failed to update due date", error);
        }
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/task/${id}`, { title: editedTitle, content: editedContent });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="card bg-base-300 shadow-xl max-w-min">
            <div className="card-body flex-row">
                <div className="min-w-96 mt-2">
                    {isEditing ? (
                        <h2 className="card-title pb-2 h-[48px]">
                            <div className="text-primary">{slug}</div>
                            <input
                                type="text"
                                value={editedTitle || ''}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="input input-bordered"
                            />
                            <div onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                 className="cursor-pointer text-primary text-xl">
                                {isEditing ? <BsCheckLg/> : <BsFillPencilFill/>}
                            </div>
                        </h2>
                    ) : (
                        <h2 className="card-title pb-2 h-[48px]">
                            <div className="text-primary">{slug}</div>
                            {editedTitle}
                            {canEdit && (
                                <div onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                     className="cursor-pointer text-primary text-xl">
                                    {isEditing ? <BsCheckLg/> : <BsFillPencilFill/>}
                                </div>
                            )}
                        </h2>
                    )}
                    {isEditing ? (
                        <textarea
                            value={editedContent || ''}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="textarea textarea-bordered w-full h-48"
                        />
                    ) : (
                        <p className="text-base-content pr-2">{editedContent || '-'}</p>
                    )}
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
                                <td className="w-28">Due Date</td>
                                <td className="flex items-center w-36">
                                    {selectedDate ? (selectedDate < new Date() ?
                                        <span className="badge badge-error bg-red-700">{formatDate(selectedDate)}</span> :
                                        <span className="badge badge-accent">{formatDate(selectedDate)}</span>) : '-'}
                                    {canEdit && (
                                        <BsFillPencilFill className="text-primary ml-1 cursor-pointer" onClick={() => setIsDatePickerOpen(true)} />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>Priority</td>
                                <td>
                                    {canEdit ? (
                                        <select className="badge badge-error cursor-pointer px-1" value={currentPriority}
                                                onChange={handlePriorityChange}>
                                            {priorities.map((priority) => (
                                                <option key={priority.id} value={priority.id}>{priority.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>{priorities.find(priority => priority.id === currentPriority)?.name || '-'}</span>
                                    )}
                                </td>
                            </tr>
                            <tr className="bg-base-200">
                                <td>Creator</td>
                                <td>{creatorName || '-'}</td>
                            </tr>
                            <tr>
                                <td>Assignee</td>
                                <td>
                                    {canEdit ? (
                                        <select className="badge badge-accent cursor-pointer px-1 max-w-24 overflow-ellipsis" value={currentUser}
                                                onChange={handleUserChange}>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>{users.find(user => user.id === currentUser)?.name || '-'}</span>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isDatePickerOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="card">
                        <DatePicker
                            dateFormat="yyyy-MM-dd"
                            selected={selectedDate}
                            onChange={handleDateChange}
                            inline
                        />
                        <button onClick={() => setIsDatePickerOpen(false)} className="btn btn-primary mt-2">Close</button>
                        <button onClick={() => handleDateChange(null)} className="btn btn-secondary mt-2">Clear Date</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Task;
