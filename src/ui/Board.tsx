import React from "react";
import Card from "@/ui/Card";
import {CardData} from "@/interfaces/CardData";
import Link from "next/link";

interface BoardProps {
    id: string;
    statuses: string[];
    cards: CardData[];
}

const Board: React.FC<BoardProps> = ({id, statuses, cards}) => {

    return (
        <div className="flex space-x-4">
            {statuses.map((status) => (
                <div key={status} className="card bg-base-100">
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
                                        >
                                            <p>{card.content}</p>
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
