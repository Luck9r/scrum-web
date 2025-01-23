'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Task from "@/ui/Task";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TaskData } from "@/interfaces/TaskData";

const fetchTaskData = async (slug: string | Array<string> | undefined): Promise<TaskData> => {
    try {
        const response = await axios.get(`/api/tasks/${slug}`);
        const data = response.data;
        return {
            id: data.id,
            slug: data.slug,
            title: data.title,
            content: data.content,
            dueDate: data.due_date,
            priority: data.priority,
            status: data.status,
            statusId: data.status_id,
            boardId: data.board_id,
            assigneeId: data.assignee_id,
            creatorId: data.creator_id,
            assigneeName: data.assignee_name,
            creatorName: data.creator_name,
        };
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch task");
    }
};

const fetchStatuses = async (id: string): Promise<{ id: string, name: string }[]> => {
    try {
        const response = await axios.get(`/api/board/${id}/statuses`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch statuses");
    }
};

const TaskPage = () => {
    const [task, setTask] = useState<TaskData | null>(null);
    const [statuses, setStatuses] = useState<{ id: string, name: string }[]>([]);
    const params = useParams();

    useEffect(() => {
        fetchTaskData(params.slug).then(setTask).catch(console.error);
    }, [params]);

    useEffect(() => {
        if (task) {
            fetchStatuses(task.boardId).then(setStatuses).catch(console.error);
        }
    }, [task]);

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-full w-full space-y-4">
            <Link className="btn btn-primary" href={"/boards/" + task.boardId}>Go to Board</Link>
            <Task
                task={task}
                statuses={statuses}
            />
        </div>
    );
};

export default TaskPage;
