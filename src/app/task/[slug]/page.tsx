import React from "react";
import Task from "@/ui/Task";


const fetchCardData = (slug: string) => {
    // const response = await fetch(`https://api.example.com/tasks/${slug}`);
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
    };
};

const TaskPage = async ({params,}: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;
    const task = fetchCardData(slug);

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200">
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
