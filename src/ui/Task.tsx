import React from "react";

interface TaskProps {
    title: string;
    content: string;
    status: string;
    dueDate?: string;
    priority?: string;
}

const Task: React.FC<TaskProps> = ({ title, content, status, dueDate, priority }) => {
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title ">{title}</h2>
                <p className="text-base-content">{content}</p>
                <p className="text-sm text-gray-500">Status: {status}</p>
                {dueDate && <p className="text-sm text-gray-500">Due Date: {dueDate}</p>}
                {priority && <p className="text-sm text-gray-500">Priority: {priority}</p>}
            </div>
        </div>
    );
};

export default Task;
