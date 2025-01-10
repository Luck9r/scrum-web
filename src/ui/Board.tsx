import React from "react";
import Card from "@/ui/Card";
import {TaskData} from "@/interfaces/TaskData";
import Link from "next/link";

interface BoardProps {
    id: string;
    statuses: string[];
    cards: TaskData[];
}

const Board: React.FC<BoardProps> = ({id, statuses, cards}) => {

    return (
        <div className="flex space-x-4">
            {statuses.map((status) => (
                <div key={status} className="card bg-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-base-content">{status}</h2>
                        <div className="items-center">
                            {cards
                                .filter((card) => card.status === status)
                                .map((card) => (
                                    <Link key={card.slug} href={"/task/" + card.slug}>
                                        <Card
                                            title={card.title}
                                            slug={card.slug}
                                            boardId={card.boardId}
                                            dueDate={card.dueDate}
                                            content={card.content}
                                            status={card.status}>
                                        </Card>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Board;
