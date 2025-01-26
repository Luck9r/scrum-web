import React from "react";
import { TaskData } from "@/interfaces/TaskData";

interface CardProps {
    task: TaskData;
    children?: React.ReactNode;
}

const TaskCard: React.FC<CardProps> = ({ task, children }) => {
    const { title, dueDate, content, slug } = task;

    return (
        <div className={"card card-compact bg-secondary text-secondary-content w-96 shadow-xl my-3"}>
            <div className="card-body m-3">
                <h2 className="card-title">
                    <div className="font-light">{slug}</div>
                    {title}
                    {dueDate ? <p className="text-xs font-thin">{dueDate}</p> : null}
                </h2>
                <div className="line-clamp-2">
                    <p>{content}</p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default TaskCard;
