'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Board from "@/ui/Board";
import { TaskData } from "@/interfaces/TaskData";
import { BoardData } from "@/interfaces/BoardData";
import { useParams } from "next/navigation";

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
            priority: task.priority,
            status: task.status,
            dueDate: task.due_date,
            boardId: task.board_id,
            assigneeName: task.assignee_name,
        }));
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch tasks");
    }
};

const fetchBoardData = async (id: string | Array<string> | undefined): Promise<BoardData> => {
    try {
        const response = await axios.get(`/api/board/${id}`);
        const data = response.data;
        return {
            id: data.id,
            title: data.title,
            tasks: await fetchTasks(id)
        };
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch board data");
    }
};

const BoardPage = () => {
    const [statuses, setStatuses] = useState<string[]>([]);
    const [board, setBoard] = useState<BoardData | null>(null);
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        fetchStatuses(id).then(setStatuses).catch(console.error);
        fetchBoardData(id).then(setBoard).catch(console.error);
    }, [id]);

    if (!board) {
        return <div>Loading...</div>;
    }

    return (
        <div className="">
            <Board id={board.id} name={board.title} statuses={statuses} tasks={board.tasks}/>
        </div>
    );
};

export default BoardPage;
