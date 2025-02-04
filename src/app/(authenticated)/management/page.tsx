'use client'
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';
import withRole from "@/components/withRole";
import { TaskData } from "@/interfaces/TaskData";
import { BoardData } from "@/interfaces/BoardData";
import TaskCard from "@/ui/TaskCard";
import BoardCard from "@/ui/BoardCard";
import {UserData} from "@/interfaces/UserData";
import UserCard from "@/ui/UserCard";

const ManagementPanel = () => {
    const [boards, setBoards] = useState<BoardData[]>([]);
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [users, setUsers] = useState([]);
    const [newBoardName, setNewBoardName] = useState('');
    const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [userSearchTerm, setUserSearchTerm] = useState('');


    const fetchBoards = async () => {
        try {
            const response = await axios.get('/api/board');
            setBoards(response.data);
        } catch (error) {
            console.error('Error fetching board:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const filterUsers = (users: UserData[], searchTerm: string): UserData[] => {
        return users.filter(user =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const addBoard = async () => {
        try {
            const response = await axios.post('/api/board', { title: newBoardName });
            setBoards([...boards, response.data]);
            setNewBoardName('');
        } catch (error) {
            console.error('Error adding board:', error);
        }
    };

    const removeBoard = async (board_id: string) => {
        try {
            await axios.delete(`/api/board/${board_id}`);
            setBoards(boards.filter(board => board.id !== board_id));
        } catch (error) {
            console.error('Error removing board:', error);
        }
    };


    const removeTask = async (taskId: string) => {
        try {
            await axios.delete(`/api/task/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error removing task:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };


    const assignUserToBoard = async (userId: number) => {
        try {
            if (selectedBoard) {
                await axios.post(`/api/board/${selectedBoard}/assign-user`, { user_id: userId });
                console.log(`User ${userId} assigned to board ${selectedBoard}`);
            } else {
                console.warn("No board selected for user assignment.");
            }
        } catch (error) {
            console.error('Error assigning user to board:', error);
        }
    };

    const unassignUserFromBoard = async (userId: number) => {
        try {
            if (selectedBoard) {
                await axios.post(`/api/board/${selectedBoard}/unassign-user`, { user_id: userId });
                console.log(`User ${userId} unassigned from board ${selectedBoard}`);
            } else {
                console.warn("No board selected for user unassignment.");
            }
        } catch (error) {
            console.error('Error unassigning user from board:', error);
        }
    };

    const filterTasks = (tasks: TaskData[], searchTerm: string): TaskData[] => {
        return tasks.filter(task =>
            task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.slug?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const removeUser = async (userId: number) => {
        try {
            await axios.delete(`/api/user/${userId}`);
            setUsers(users.filter((user: UserData) => user.id !== userId));
        } catch (error) {
            console.error('Error removing user:', error);
        }
    }

    useEffect(() => {
        void fetchBoards();
        void fetchTasks();
        void fetchUsers();
    }, []);

    const filteredTasks = filterTasks(tasks, searchTerm);
    const filteredUsers = filterUsers(users, userSearchTerm);


    return (<>

        <h1 className="text-3xl font-semibold mb-4 ml-10">Management Panel</h1>
    <div className="p-4 flex flex-row justify-around">

    <div className="ml-6 max-h-min">
                <h2 className="text-2xl font-semibold m-4">Boards</h2>
        <div className="flex flex-row justify-around">
                <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="New Board Name"
                    className="input input-bordered mb-2"
                />
                <button onClick={addBoard} className="btn btn-primary mb-4">Add Board</button>
        </div>
        <div className=" overflow-scroll">
                {boards.map((board) => (
                    <BoardCard board={board} key={board.id} >
                        <div className="card-actions justify-end">
                            <Link href={`/board/${board.id}`}>
                                <button className="btn">Edit</button>
                            </Link>
                            <button onClick={() => removeBoard(board.id)}
                                    className="btn btn-error">Remove
                            </button>

                        </div>
                    </BoardCard>
                ))}
        </div>
    </div>
        <div className="ml-6 max-h-min">
            <h2 className="text-2xl font-semibold m-4">Tasks</h2>
                <label className="input input-bordered flex items-center gap-2 w-60 m-1">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filter Tasks"
                        className="grow"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"/>
                    </svg>
                </label>
                <div className="overflow-y-auto max-w-min">
                    {filteredTasks.map((task: TaskData) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                            >
                                <div className="card-actions justify-end">
                                    <Link href={`/task/${task.slug}`} key={task.id}><button className="btn ">Edit</button></Link>
                                    <button onClick={() => removeTask(task.id)} className="btn btn-error">Remove
                                    </button>
                                </div>
                            </TaskCard>
                    ))}
                </div>
            </div>
        <div className="ml-6 max-h-min">
            <h2 className="text-2xl font-semibold m-4">Users</h2>
            <label className="input input-bordered flex items-center gap-2 w-60 m-1">
                <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Filter Users"
                    className="grow"
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"/>
                </svg>
            </label>
            <div className="overflow-y-auto max-w-min"> {/* Added max-h and overflow */}
                {filteredUsers.map((user: UserData) => (
                    <UserCard user={user} key={user.id}>
                        <div className="">
                            <div className="flex flex-row justify-between">
                            <select onChange={(e) => setSelectedBoard(e.target.value)}
                                    className="select select-bordered w-32 mr-2">
                                <option value="">Select Board</option>
                                {boards.map((board) => (
                                    <option key={board.id} value={board.id}>{board.title}</option>
                                ))}
                            </select>
                            <button onClick={() => assignUserToBoard(user.id)} className="btn btn-primary mr-2">Assign
                            </button>
                            <button onClick={() => unassignUserFromBoard(user.id)}
                                    className="btn btn-secondary mr-2">Unassign
                            </button>
                        </div>
                            <div className="flex flex-row justify-end mr-2 ">
                                <Link href={`/user/${user.id}`}><button className="btn mt-2">Edit</button></Link>
                                <button className="btn btn-error mt-2 ml-2" onClick={() => removeUser(user.id)}>Remove</button>
                            </div>
                        </div>

                    </UserCard>
                ))}
            </div>
        </div>
    </div>
        </>
    );
};

const ProtectedManagementPanel = withRole(ManagementPanel, ['admin']);

export default ProtectedManagementPanel;
