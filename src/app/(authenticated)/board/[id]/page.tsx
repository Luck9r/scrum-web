'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Board from "@/ui/Board";
import { TaskData } from "@/interfaces/TaskData";
import { BoardData } from "@/interfaces/BoardData";
import { useParams } from "next/navigation";
import { BsFilter } from "react-icons/bs";

const fetchStatuses = async (id: string | Array<string> | undefined): Promise<{ id: string, name: string }[]> => {
    try {
        const response = await axios.get(`/api/board/${id}/statuses`);
        return response.data.map((status: { id: string, name: string }) => ({
            id: status.id,
            name: status.name,
        }));
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
            statusId: task.status_id,
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
    const [statuses, setStatuses] = useState<{ id: string, name: string }[]>([]);
    const [board, setBoard] = useState<BoardData | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);
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
            {!editMode && (
                <label className="input input-bordered flex items-center gap-2 w-60 m-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filter Tasks"
                        className="grow"
                    />
                    <BsFilter />
                </label>
            )}
            {editMode && <div className="h-20"> </div>}
            <Board id={board.id} name={board.title} statuses={statuses} tasks={board.tasks} searchTerm={searchTerm} editMode={editMode} setEditMode={setEditMode} />
        </div>
    );
};

export default BoardPage;
