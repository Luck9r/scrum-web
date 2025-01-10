// src/app/tasks/page.tsx
import React from "react";
import Card from "@/ui/Card";
import { TaskData } from "@/interfaces/TaskData";
import Link from "next/link";

const fetchTasks = async (): Promise<TaskData[]> => {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
    // if (!response.ok) {
    //     throw new Error("Failed to fetch tasks");
    // }
    // const data = await response.json();
    // return data.tasks;

    // Mock data for demonstration purposes
    return [
        {
            slug: "task-1",
            title: "Task 1",
            content: "Content for task 1",
            status: "In Progress",
            dueDate: "2023-12-31",
            priority: "High",
            boardId: "1"
        },
        {
            slug: "task-2",
            title: "Task 2",
            content: "Content for task 2",
            status: "Completed",
            dueDate: "2023-11-30",
            priority: "Medium",
            boardId: "2"
        }
    ];
};

const TasksPage = async () => {
    const tasks = await fetchTasks();
    const groupedTasks = tasks.reduce((groupedTasks, task) => {
        if (!groupedTasks[task.boardId]) {
            groupedTasks[task.boardId] = [];
        }
        groupedTasks[task.boardId].push(task);
        return groupedTasks;
    }, {} as Record<string, TaskData[]>);

    return (
        <div className="flex space-x-4 p-4">
            {Object.entries(groupedTasks).map(([boardId, tasks]) => (
                <div key={boardId} className="card bg-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-base-content">Board {boardId}</h2>
                        <div className="items-center">
                            {tasks.map((task) => (
                                <Link key={task.slug} href={"/task/" + task.slug}>
                                    <Card
                                        key={task.slug}
                                        title={task.title}
                                        slug={task.slug}
                                        boardId={task.boardId}
                                        dueDate={task.dueDate}
                                        content={task.content}
                                        status={task.status}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TasksPage;
