'use client';

import React, {useEffect, useState} from 'react';
import axios from '@/lib/axios';
import Board from "@/ui/Board";
import {TaskData} from "@/interfaces/TaskData";
import {useParams} from "next/navigation";

const fetchStatuses = async (id: string | Array<string> | undefined): Promise<string[]> => {
    try {
        const response = await axios.get(`/api/board/${id}/statuses`);
        return response.data.map((status: { name: string; }) => status.name);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch statuses");
    }
};

const fetchTasks = async (id: string | Array<string> | undefined): Promise<TaskData[]> => {
    try {
        const response = await axios.get(`/api/board/${id}/tasks`);
        return response.data.map((task: any) => ({
            id: task.id,
            slug: task.slug,
            title: task.title,
            content: task.content,
            status: task.status,
            dueDate: task.due_date,
            boardId: task.board_id
        }));
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch tasks");
    }
};

const fetchBoardName = async (id: string | Array<string> | undefined): Promise<string> => {
    try {
        const response = await axios.get(`/api/board/${id}`);
        return response.data.title;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch board name");
    }
};

const BoardPage = () => {
    const [statuses, setStatuses] = useState<string[]>([]);
    const [cards, setCards] = useState<TaskData[]>([]);
    const [name, setName] = useState<string>('');
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        fetchStatuses(id).then(setStatuses).catch(console.error);
        fetchTasks(id).then(setCards).catch(console.error);
        fetchBoardName(id).then(setName).catch(console.error);
    }, [id]);

    return (
        <div className="p-4">
            <Board id={id} name={name} statuses={statuses} tasks={cards} />
        </div>
    );
};

export default BoardPage;
