import React from "react";
import Task from "@/ui/Task";
import Link from "next/link";


const fetchCardData = async (slug: string) => {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${slug}`);
    // if (!response.ok) {
    //     throw new Error("Failed to fetch task");
    // }
    // const data = await response.json();
    // return data;

    return {
        title: "Task Title",
        content: "Task Content",
        status: "Task Status",
        dueDate: "Task Due Date",
        priority: "Task Priority",
        boardId: "1",
    };
};

const TaskPage = async ({params,}: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;
    const task = await fetchCardData(slug);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
            <Link className="btn btn-primary" href={"/boards/"+task.boardId}>Go to Board</Link>
            <Task
                title={task.title}
                content={task.content}
                status={task.status}
                dueDate={task.dueDate}
                priority={task.priority}
            />
        </div>
    );
};

export default TaskPage;
