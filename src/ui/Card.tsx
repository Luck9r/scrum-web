import React from "react";

interface CardProps {
    slug: string;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children }) => {
    return (
        <div
            className={"card card-compact bg-accent text-accent-content w-96 shadow-xl my-3"}
        >
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                {subtitle ? <p className="text-xs">{subtitle}</p> : null}
                <div className="line-clamp-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Card;
