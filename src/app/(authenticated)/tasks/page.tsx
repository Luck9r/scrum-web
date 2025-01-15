'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Card from "@/ui/Card";
import { TaskData } from "@/interfaces/TaskData";
import Link from "next/link";

const fetchTasks = (): Promise<TaskData[]> => {
    return axios.get(`/api/tasks`)
        .then(response => {
            const tasks = response.data.map((task: any) => {
                const taskData: TaskData = {
                    id: task.id,
                    slug: task.slug,
                    title: task.title,
                    content: task.content,
                    status: task.status_id,
                    dueDate: task.due_date,
                    boardId: task.board_id
                };
                console.log(taskData);
                return taskData;
            });
            return tasks;
        })
        .catch(error => {
            console.log(error);
            throw new Error("Failed to fetch tasks");
        });
};

const TasksPage = () => {
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [boardTitles, setBoardTitles] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchTasks().then(setTasks).catch(console.error);
    }, []);

    useEffect(() => {
        const boardIds = Array.from(new Set(tasks.map(task => task.boardId)));
        boardIds.forEach(boardId => {
            axios.get(`/api/board/${boardId}`)
                .then(response => {
                    setBoardTitles(prevTitles => ({
                        ...prevTitles,
                        [boardId]: response.data.title
                    }));
                })
                .catch(error => {
                    console.log(error);
                });
        });
    }, [tasks]);

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
                        <h2 className="card-title text-base-content">{boardTitles[boardId] || `Board ${boardId}`}</h2>
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
