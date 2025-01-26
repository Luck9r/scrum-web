import React, { useState } from "react";
import TaskCard from "@/ui/TaskCard";
import { TaskData } from "@/interfaces/TaskData";
import Link from "next/link";
import { useAuth } from '@/hooks/auth';
import {DndContext, DragOverlay, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import { BsCheckLg, BsFillPencilFill } from "react-icons/bs";
import axios from "@/lib/axios";
import Draggable from "@/ui/Draggable";
import Droppable from "@/ui/Droppable";

interface BoardProps {
    id: string | Array<string> | undefined;
    statuses: { id: string, name: string }[];
    tasks: TaskData[] | undefined;
    name: string;
}

const Board: React.FC<BoardProps> = ({ statuses, tasks, name }) => {
    const { user } = useAuth({ middleware: 'auth' });
    const [editMode, setEditMode] = useState(false);
    const [boardName, setBoardName] = useState(name);
    const [boardStatuses, setBoardStatuses] = useState(statuses);
    const [boardTasks, setBoardTasks] = useState(tasks || []);
    const [isDragging, setIsDragging] = useState(false);
    const [activeTask, setActiveTask] = useState<TaskData | null>(null);
    const [hoveredStatusId, setHoveredStatusId] = useState<string | null>(null);

    const allowedRoles = ['admin', 'product_owner', 'scrum_master'];
    const canEdit = user && user.roles.some((role: { name: string }) => allowedRoles.includes(role.name));

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBoardName(e.target.value);
    };

    const handleStatusChange = (index: number, newStatus: { id: string, name: string }) => {
        const updatedStatuses = [...boardStatuses];
        updatedStatuses[index] = newStatus;
        setBoardStatuses(updatedStatuses);
    };

    const addStatus = () => {
        setBoardStatuses([...boardStatuses, { id: "", name: "" }]);
    };

    const updateTaskStatus = async (taskId: string, statusId: string) => {
        try {
            await axios.put(`/api/task/${taskId}`, { status_id: statusId });
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };

    const handleDragStart = (event: any) => {
        setIsDragging(true);
        const task = boardTasks.find(task => task.id === event.active.id);
        setActiveTask(task || null);
    };

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        setIsDragging(false);
        setActiveTask(null);
        setHoveredStatusId(null);
        if (over && over.data.current) {
            const statusId = over.data.current.statusId;
            const updatedTasks = boardTasks.map(task => {
                if (task.id === active.id) {
                    updateTaskStatus(task.id, statusId);
                    return { ...task, statusId: statusId };
                }
                return task;
            });
            setBoardTasks(updatedTasks);
        }
    };

    const handleDragOver = (event: any) => {
        const { over } = event;
        if (over) {
            setHoveredStatusId(over.id);
        } else {
            setHoveredStatusId(null);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver} sensors={sensors}>
            <div className="flex p-4">
                {editMode ? (
                    <input
                        type="text"
                        value={boardName}
                        onChange={handleBoardNameChange}
                        className="input input-bordered"
                    />
                ) : (
                    <h1 className="text-4xl text-primary pb-5">{boardName}</h1>
                )}
                {canEdit && (
                    <div onClick={handleEditToggle} className="cursor-pointer text-primary text-2xl ml-2 pt-2">
                        {editMode ? <BsCheckLg /> : <BsFillPencilFill />}
                    </div>
                )}
            </div>
            <div className="flex space-x-4 pl-4">
                {boardStatuses.map((status, index) => (
                    <Droppable key={index} id={status.id} statusId={status.id}>
                        <div className="card bg-base-300 min-w-60">
                            <div className="card-body">
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={status.name}
                                        onChange={(e) => handleStatusChange(index, { ...status, name: e.target.value })}
                                        className="input text-primary"
                                    />
                                ) : (
                                    <h2 className="card-title text-base-content">{status.name}</h2>
                                )}
                                {!editMode && (
                                    <div className="items-center">
                                        {boardTasks
                                            .filter((task) => task.statusId === status.id)
                                            .map((task) => (
                                                <Draggable key={task.slug} id={task.id}>
                                                    {isDragging ? (
                                                        <TaskCard task={task} isDragging={isDragging} activeTaskId={activeTask?.id}>
                                                            <div className="flex flex-row space-x-2">
                                                                {task.assigneeName && <div className="badge badge-accent">{task.assigneeName}</div>}
                                                                {task.priority && <div className="badge badge-primary">{task.priority}</div>}
                                                            </div>
                                                        </TaskCard>
                                                    ) : (
                                                        <Link href={"/task/" + task.slug}>
                                                            <TaskCard task={task} isDragging={isDragging} activeTaskId={activeTask?.id}>
                                                                <div className="flex flex-row space-x-2">
                                                                    {task.assigneeName && <div className="badge badge-accent">{task.assigneeName}</div>}
                                                                    {task.priority && <div className="badge badge-primary">{task.priority}</div>}
                                                                </div>
                                                            </TaskCard>
                                                        </Link>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {hoveredStatusId === status.id && activeTask && activeTask.statusId !== status.id && (
                                            <div className="">
                                                <TaskCard>
                                                </TaskCard>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Droppable>
                ))}
                {editMode && canEdit && (
                    <button onClick={addStatus} className="btn btn-primary">
                        +
                    </button>
                )}
            </div>
            <DragOverlay>
                {activeTask ? (
                    <TaskCard task={activeTask}>
                        <div className="flex flex-row space-x-2">
                            {activeTask.assigneeName && <div className="badge badge-accent">{activeTask.assigneeName}</div>}
                            {activeTask.priority && <div className="badge badge-primary">{activeTask.priority}</div>}
                        </div>
                    </TaskCard>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default Board;
