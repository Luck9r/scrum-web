import React from "react";
import {TaskData} from "@/interfaces/TaskData";

interface CardProps extends TaskData {
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, dueDate, children, content }) => {

    return (
        <div
            className={"card card-compact bg-secondary text-secondary-content w-96 shadow-xl my-3"}
        >
            <div className="card-body">
                <h2 className="card-title">{title}{dueDate ? <p className="text-xs font-thin">{dueDate}</p> : null}</h2>

                <div className="line-clamp-1">
                    <p>{content}</p>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Card;
