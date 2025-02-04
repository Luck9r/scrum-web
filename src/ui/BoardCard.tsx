import React from "react";
import { BoardData } from "@/interfaces/BoardData";

interface BoardCardProps {
    board: BoardData;
    children?: React.ReactNode;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, children }) => {
    const { title } = board;

    return (

            <div className="card card-compact bg-primary text-primary-content w-96 shadow-xl my-3">
                <div className="card-body m-3">

                        <div className="flex flex-row items-center justify-between"><div className="font-bold text-xl line-clamp-1">{title}</div></div>

                    {children}

                </div>
            </div>

    );
};

export default BoardCard;
