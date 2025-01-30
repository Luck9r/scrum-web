import React, { useState } from "react";
import TaskCard from "@/ui/TaskCard";
import { TaskData } from "@/interfaces/TaskData";
import Link from "next/link";
import { useAuth } from '@/hooks/auth';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";
import SortableItem from "@/ui/SortableItem";
import {
    BsCheckLg, BsFileEarmarkPlusFill,
    BsFillPencilFill,
    BsTrash
} from "react-icons/bs";
import axios from "@/lib/axios";
import Draggable from "@/ui/Draggable";
import Droppable from "@/ui/Droppable";

interface BoardProps {
    id: string | Array<string> | undefined;
    statuses: { id: string, name: string }[];
    tasks: TaskData[] | undefined;
    searchTerm: string | undefined;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    name: string;
}

const Board: React.FC<BoardProps> = ({ id, statuses, tasks, name, searchTerm, editMode, setEditMode }) => {
    const { user } = useAuth({ middleware: 'auth' });
    const [boardName, setBoardName] = useState(name);
    const [editedBoardName, setEditedBoardName] = useState(name);
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
        setEditedBoardName(e.target.value);
    };

    const handleBoardNameSave = async () => {
        try {
            await axios.put(`/api/board/${id}`, { title: editedBoardName });
            setBoardName(editedBoardName);
            setEditMode(false);
        } catch (error) {
            console.error('Failed to update board name:', error);
        }
    };

    const addStatus = async () => {
        try {
            const response = await axios.post(`/api/boards/${id}/statuses`, { name: "New Status" });
            const newStatus = response.data;
            setBoardStatuses([...boardStatuses, newStatus]);
        } catch (error) {
            console.error('Failed to add status:', error);
        }
    };

    const deleteStatus = async (statusId: string) => {
        try {
            await axios.delete(`/api/boards/${id}/status/${statusId}`);
            setBoardStatuses(boardStatuses.filter(status => status.id !== statusId));
        } catch (error) {
            console.error('Failed to delete status:', error);
        }
    };

    const handleStatusNameChange = (index: number, newName: string) => {
        const updatedStatuses = [...boardStatuses];
        updatedStatuses[index].name = newName;
        void handleStatusSave(index);
        setBoardStatuses(updatedStatuses);
    };

    const handleStatusSave = async (index: number) => {
        const status = boardStatuses[index];
        try {
            await axios.put(`/api/boards/${id}/status/${status.id}`, { name: status.name });
        } catch (error) {
            console.error('Failed to update status name:', error);
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

        if (!over) return;

        if (editMode) {
            if (over.id !== active.id) {
                const oldIndex = boardStatuses.findIndex(status => status.id === active.id);
                const newIndex = boardStatuses.findIndex(status => status.id === over.id);
                const newOrder = arrayMove(boardStatuses, oldIndex, newIndex);
                setBoardStatuses(newOrder);

                try {
                    await axios.put(`/api/boards/${id}/statuses/order`, {
                        statuses: newOrder.map((status, index) => ({ id: status.id, order: index }))
                    });
                } catch (error) {
                    console.error('Failed to update status order:', error);
                }
            }
        } else {
            const statusId = over.data.current?.statusId;
            if (statusId) {
                const updatedTasks = boardTasks.map(task => {
                    if (task.id === active.id) {
                        updateTaskStatus(task.id, statusId);
                        return { ...task, statusId: statusId };
                    }
                    return task;
                });
                setBoardTasks(updatedTasks);
            }
        }
    };

    const updateTaskStatus = async (taskId: string, statusId: string) => {
        try {
            await axios.put(`/api/task/${taskId}`, {status_id: statusId});
        } catch (error) {
            console.error('Failed to update task status:', error);
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

    const addTask = async () => {
        try {
            const response = await axios.post(`/api/boards/${id}/tasks`, { title: "New Task", status_id: boardStatuses[0].id });
            const newTask: TaskData = {
                id: response.data.id,
                slug: response.data.slug,
                title: response.data.title,
                priority: response.data.priority_name,
                status: response.data.status_id,
                statusId: response.data.status_id,
                boardId: response.data.board_id,
                creatorId: response.data.creator_id,
                creatorName: response.data.creator_name,
                assigneeName: response.data.assignee_name,
                content: response.data.content,
            };
            setBoardTasks([...boardTasks, newTask]);
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const filteredTasks = boardTasks.filter(task =>
        task.title?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        task.content?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        task.slug?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <div className="flex p-4">
                {editMode ? (
                    <input
                        type="text"
                        value={editedBoardName}
                        onChange={handleBoardNameChange}
                        className="input input-bordered"
                    />
                ) : (
                    <h1 className="text-4xl text-primary pb-5">{boardName}</h1>
                )}
                {canEdit && (
                    <>
                        <div onClick={editMode ? handleBoardNameSave : handleEditToggle} className="cursor-pointer text-primary text-2xl ml-2 pt-2">
                            {editMode ? <BsCheckLg /> : <BsFillPencilFill />}
                        </div>
                        <div onClick={addTask} className="btn btn-primary ml-3">
                            New Task <BsFileEarmarkPlusFill className="text-xl" />
                        </div>
                    </>
                )}
            </div>
            {editMode ? (
                <SortableContext items={boardStatuses} strategy={horizontalListSortingStrategy}>
                    <div className="flex space-x-4 pl-4">
                        {boardStatuses.map((status, index) => (
                            <SortableItem key={status.id} id={status.id}>
                                <Droppable id={status.id} statusId={status.id}>
                                    <div className="card bg-base-300 min-w-60">
                                        <div className="card-body">
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={status.name}
                                                    onChange={(e) => handleStatusNameChange(index, e.target.value)}
                                                    className="input input-bordered"
                                                />
                                                <div onClick={() => deleteStatus(status.id)} className="cursor-pointer text-primary text-xl ml-2">
                                                    <BsTrash />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Droppable>
                            </SortableItem>
                        ))}
                        <div onClick={addStatus} className="btn bg-base-300 min-h-28 min-w-28 text-4xl">
                            +
                        </div>
                    </div>
                </SortableContext>
            ) : (
                <div className="flex space-x-4 pl-4">
                    {boardStatuses.map((status) => (
                        <Droppable key={status.id} id={status.id} statusId={status.id}>
                            <div className="card bg-base-300 min-w-96">
                                <div className="card-body">
                                    <h2 className="card-title text-base-content">{status.name}</h2>
                                    <div className="items-center">
                                        {filteredTasks
                                            .filter(task => task.statusId === status.id)
                                            .map(task => (
                                                <Draggable key={task.id} id={task.id}>
                                                    <Link href={`/task/${task.slug}`}>
                                                        <TaskCard task={task} isDragging={isDragging} activeTaskId={activeTask?.id}>
                                                            <div className="flex flex-row space-x-2">
                                                                {task.assigneeName && <div className="badge badge-accent">{task.assigneeName}</div>}
                                                                {task.priority && <div className="badge badge-primary">{task.priority}</div>}
                                                            </div>
                                                        </TaskCard>
                                                    </Link>
                                                </Draggable>
                                            ))}
                                        {hoveredStatusId === status.id && activeTask?.statusId !== status.id && <TaskCard/>}
                                    </div>
                                </div>
                            </div>
                        </Droppable>
                    ))}
                </div>
            )}
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
