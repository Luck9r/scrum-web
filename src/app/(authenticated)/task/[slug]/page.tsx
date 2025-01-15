'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Task from "@/ui/Task";
import Link from "next/link";
import {useParams} from "next/navigation";

const fetchTaskData = (slug: string | Array<string> | undefined): Promise<any> => {
    return axios.get(`/api/tasks/${slug}`)
        .then(response => response.data)
        .catch(error => {
            console.log(error);
            throw new Error("Failed to fetch task");
        });
};

const TaskPage = () => {
    const [task, setTask] = useState<any>(null);
    const params = useParams();

    useEffect(() => {
        fetchTaskData(params.slug).then(setTask).catch(console.error);
    }, [params]);

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-full w-full space-y-4">
            <Link className="btn btn-primary" href={"/boards/" + task.board_id}>Go to Board</Link>
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
