import React from "react";
import Link from "next/link";
import { BoardData } from "@/interfaces/BoardData";

interface BoardCardProps {
    board: BoardData;
    children?: React.ReactNode;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, children }) => {
    const { id, title } = board;

    return (
        <div className="card card-compact bg-primary text-primary-content w-96 shadow-xl my-3">
            <div className="card-body m-3">
                <h2 className="card-title">
                    <Link href={`/boards/${id}`}>
                        <a className="font-bold">{title}</a>
                    </Link>
                </h2>
                {children}
            </div>
        </div>
    );
};

export default BoardCard;
