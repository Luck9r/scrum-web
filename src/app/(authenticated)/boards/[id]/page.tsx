'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Board from "@/ui/Board";
import { TaskData } from "@/interfaces/TaskData";
import { useParams } from "next/navigation";

const fetchStatuses = (id: string): Promise<string[]> => {
    return axios.get(`/api/board/${id}/statuses`)
        .then(response => response.data.map((status: { name: string }) => status.name))
        .catch(error => {
            console.log(error);
            throw new Error("Failed to fetch statuses");
        });
};

const fetchTasks = (id: string): Promise<TaskData[]> => {
    return axios.get(`/api/board/${id}/tasks`)
        .then(response => {
            const tasks = response.data.map((task: any) => ({
                id: task.id,
                slug: task.slug,
                title: task.title,
                content: task.content,
                status: task.status,
                dueDate: task.due_date,
                boardId: task.board_id
            }));
            tasks.forEach(task => console.log(task));
            return tasks;
        })
        .catch(error => {
            console.log(error);
            throw new Error("Failed to fetch tasks");
        });
};

const BoardPage = () => {
    const [statuses, setStatuses] = useState<string[]>([]);
    const [cards, setCards] = useState<TaskData[]>([]);
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        fetchStatuses(id).then(setStatuses).catch(console.error);
        fetchTasks(id).then(setCards).catch(console.error);
    }, [id]);

    return (
        <div className="p-4">
            <Board id={id} statuses={statuses} cards={cards} />
        </div>
    );
};

export default BoardPage;
