'use client';

import React, {useEffect, useState} from 'react';
import axios from '@/lib/axios';
import TaskCard from "@/ui/TaskCard";
import {TaskData} from "@/interfaces/TaskData";
import Link from "next/link";
import {BsFilter} from "react-icons/bs";
import { useAuth } from '@/hooks/auth';

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
    const { user } = useAuth({ middleware: 'auth' });

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

    const addTask = async (boardId: string) => {
        try {
            const response = await axios.post(`/api/board/${boardId}/tasks`, { title: "New Task"});
            const newTask: TaskData = {
                creatorId: response.data.creator_id,
                creatorName: response.data.creator_name,
                id: response.data.id,
                slug: response.data.slug,
                title: response.data.title,
                priority: response.data.priority_name,
                status: response.data.status_id,
                statusId: response.data.status_id,
                boardId: response.data.board_id,
            };
            setTasks([ newTask, ...tasks]);
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const allowedRoles = ['admin', 'product_owner', 'scrum_master'];
    const canAdd = user && user.roles.some((role: { name: string }) => allowedRoles.includes(role.name));


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
                            <div className="flex justify-between items-center">
                                <Link href={`/board/${boardId}`}>
                                    <h2 className="card-title text-base-content w-64 line-clamp-2 overflow-ellipsis">{boardTitles[boardId] || `Board ${boardId}`}</h2>
                                </Link>
                                {canAdd && (
                                    <button onClick={() => addTask(boardId)} className="btn btn-primary ml-2">New
                                        Task</button>
                                )}

                            </div>
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
