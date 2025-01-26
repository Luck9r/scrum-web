import React from "react";
import { TaskData } from "@/interfaces/TaskData";

interface CardProps {
    task?: TaskData;
    children?: React.ReactNode;
    isDragging?: boolean;
    activeTaskId?: string;
}

const TaskCard: React.FC<CardProps> = ({ task, children, isDragging, activeTaskId }) => {
    const {title, dueDate, content, slug} = task || {};
    const isActive = isDragging && task?.id === activeTaskId;

    return (
        <div className={`card card-compact bg-secondary text-secondary-content w-96 shadow-xl my-3 ${isActive ? 'opacity-50' : ''}`}>
            <div className="card-body m-3">
                {!task ? (
                    <div className="flex w-80 flex-col gap-2">
                        <div className="flex gap-2 items-center">
                            <div className="skeleton h-6 w-20"></div>
                            <div className="skeleton h-5 w-36"></div>
                            <div className="skeleton h-3 w-14"></div>
                        </div>

                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-full"></div>
                        <div className="flex gap-2 items-center">
                            <div className="skeleton h-5 w-20"></div>
                            <div className="skeleton h-5 w-14"></div>
                        </div>

                    </div>
                ) : (
                    <>
                        <h2 className={`card-title flex ${dueDate? "justify-between":""}`}>
                            <div className="font-light">{slug}</div>
                            {title}
                            {dueDate ? <div className="text-xs font-thin ml-auto">{dueDate}</div> : null}
                        </h2>
                        <div className="line-clamp-2">
                            <p className="text-justify">{content}</p>
                        </div>
                        {children}
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
