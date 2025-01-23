'use client'
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';
import withRole from "@/components/withRole";
import { TaskData } from "@/interfaces/TaskData";
import { BoardData } from "@/interfaces/BoardData";

const ManagementPanel = () => {
    const [boards, setBoards] = useState<BoardData[]>([]);
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [users, setUsers] = useState([]);
    const [newBoardName, setNewBoardName] = useState('');
    const [newTaskName, setNewTaskName] = useState('');
    const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const fetchBoards = async () => {
        try {
            const response = await axios.get('/api/board');
            setBoards(response.data);
        } catch (error) {
            console.error('Error fetching boards:', error);
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

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
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

    const addTask = async () => {
        try {
            const response = await axios.post('/api/task', { title: newTaskName, board_id: selectedBoard });
            setTasks([...tasks, response.data]);
            setNewTaskName('');
        } catch (error) {
            console.error('Error adding task:', error);
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

    const assignUserToBoard = async () => {
        try {
            await axios.post(`/api/board/${selectedBoard}/assign-user`, { user_id: selectedUser });
        } catch (error) {
            console.error('Error assigning user to board:', error);
        }
    };

    const unassignUserFromBoard = async () => {
        try {
            await axios.post(`/api/board/${selectedBoard}/unassign-user`, { user_id: selectedUser });
        } catch (error) {
            console.error('Error unassigning user from board:', error);
        }
    };

    const assignUserToTask = async () => {
        try {
            await axios.post(`/api/task/${selectedTask}/assign-user`, { user_id: selectedUser });
        } catch (error) {
            console.error('Error assigning user to task:', error);
        }
    };

    const unassignUserFromTask = async () => {
        try {
            await axios.post(`/api/task/${selectedTask}/unassign-user`, { user_id: selectedUser });
        } catch (error) {
            console.error('Error unassigning user from task:', error);
        }
    };

    useEffect(() => {
        void fetchBoards();
        void fetchTasks();
        void fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-4">Management Panel</h1>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Boards</h2>
                <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="New Board Name"
                    className="input input-bordered mb-2"
                />
                <button onClick={addBoard} className="btn btn-primary mb-4">Add Board</button>
                {boards.map((board, index) => (
                    <div key={board.id} className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="boards-accordion" defaultChecked={index === 0} />
                        <div className="collapse-title text-xl font-medium">
                            <Link href={`/boards/${board.id}`}>{board.title}</Link>
                        </div>
                        <div className="collapse-content">
                            <button onClick={() => removeBoard(board.id)} className="btn btn-danger ml-2">Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Tasks</h2>
                <select onChange={(e) => setSelectedBoard(e.target.value)} className="select select-bordered mb-2">
                    <option value="">Select Board</option>
                    {boards.map((board) => (
                        <option key={board.id} value={board.id}>{board.title}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="New Task Name"
                    className="input input-bordered mb-2"
                />
                <button onClick={addTask} className="btn btn-primary mb-4">Add Task</button>
                {tasks.map((task: TaskData, index) => (
                    <div key={task.id} className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="tasks-accordion" defaultChecked={index === 0} />
                        <div className="collapse-title text-xl font-medium">{task.title}</div>
                        <div className="collapse-content">
                            <button onClick={() => removeTask(task.id)} className="btn btn-danger ml-2">Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Assign Users</h2>
                <select onChange={(e) => setSelectedBoard(e.target.value)} className="select select-bordered mb-2">
                    <option value="">Select Board</option>
                    {boards.map((board) => (
                        <option key={board.id} value={board.id}>{board.title}</option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedTask(e.target.value)} className="select select-bordered mb-2">
                    <option value="">Select Task</option>
                    {tasks.map((task: TaskData) => (
                        <option key={task.id} value={task.id}>{task.title}</option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedUser(e.target.value)} className="select select-bordered mb-2">
                    <option value="">Select User</option>
                    {users.map((user: any) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                <button onClick={assignUserToBoard} className="btn btn-primary mb-2">Assign User to Board</button>
                <button onClick={unassignUserFromBoard} className="btn btn-secondary mb-2">Unassign User from Board</button>
                <button onClick={assignUserToTask} className="btn btn-primary mb-2">Assign User to Task</button>
                <button onClick={unassignUserFromTask} className="btn btn-secondary mb-2">Unassign User from Task</button>
            </div>
        </div>
    );
};

const ProtectedManagementPanel = withRole(ManagementPanel, ['admin']);

export default ProtectedManagementPanel;
