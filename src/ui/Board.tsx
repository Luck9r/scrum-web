import React from "react";
import Card from "@/ui/Card";
import {TaskData} from "@/interfaces/TaskData";
import Link from "next/link";

interface BoardProps {
    id: string | Array<string> | undefined;
    statuses: string[];
    tasks: TaskData[];
    name: string;
}

const Board: React.FC<BoardProps> = ({statuses, name, tasks}) => {

    return (
        <>
            <h1 className="text-4xl text-primary pb-5"> {name}</h1>
            <div className="flex space-x-4">
                {statuses.map((status) => (
                    <div key={status} className="card bg-base-300 min-w-60">
                        <div className="card-body">
                            <h2 className="card-title text-base-content">{status}</h2>
                            <div className="items-center">
                                {tasks
                                    .filter((task) => task.status === status)
                                    .map((task) => (
                                        <Link key={task.slug} href={"/task/" + task.slug}>
                                            <Card task={task}>
                                            </Card>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Board;
