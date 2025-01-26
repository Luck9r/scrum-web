'use client';

import React, {useEffect, useState} from 'react';
import axios from '@/lib/axios';
import TaskCard from "@/ui/TaskCard";
import {TaskData} from "@/interfaces/TaskData";
import Link from "next/link";
import {BsFilter} from "react-icons/bs";

const fetchTasks = async (): Promise<TaskData[]> => {
    try {
        const response = await axios.get(`/api/tasks`);
        return response.data.map((task: any) => {
            const taskData: TaskData = {
                creatorId: task.creator_id,
                creatorName: task.creator_name,
                statusId: task.status_id,
                id: task.id,
                slug: task.slug,
                title: task.title,
                content: task.content,
                status: task.status_id,
                dueDate: task.due_date,
                boardId: task.board_id
            };
            return taskData;
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch tasks");
    }
};

const TasksPage = () => {
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [boardTitles, setBoardTitles] = useState<Record<string, string>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

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

    const filteredTasks = tasks.filter(task =>
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedTasks = filteredTasks.reduce((groupedTasks, task) => {
        if (!groupedTasks[task.boardId]) {
            groupedTasks[task.boardId] = [];
        }
        groupedTasks[task.boardId].push(task);
        return groupedTasks;
    }, {} as Record<string, TaskData[]>);

    return (
        <div className="p-4">
            <label className="input input-bordered flex items-center gap-2 w-60 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter Tasks"
                    className="grow"
                />
                <BsFilter/>
            </label>
            <div className="flex space-x-4">
                {Object.entries(groupedTasks).map(([boardId, tasks]) => (
                    <div key={boardId} className="card bg-base-300">
                        <div className="card-body">
                            <Link href={`/board/${boardId}`}><h2 className="card-title text-base-content">{boardTitles[boardId] || `Board ${boardId}`}</h2></Link>
                            <div className="items-center">
                                {tasks.map((task) => (
                                    <Link key={task.slug} href={"/task/" + task.slug}>
                                        <TaskCard
                                            key={task.slug}
                                            task={task}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TasksPage;
