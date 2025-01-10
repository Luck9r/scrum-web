import Board from "@/ui/Board";
import {TaskData} from "@/interfaces/TaskData";


const fetchStatuses = async (id: string): Promise<string[]> => {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards/${id}/statuses`);
    // if (!response.ok) {
    //     throw new Error("Failed to fetch statuses");
    // }
    // const data = await response.json();
    // return data.statuses;

    // Mock data
    return ["todo", "in-progress", "done"];
};

const fetchCards = async (id: string): Promise<TaskData[]> => {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards/${id}/tasks`);
    // if (!response.ok) {
    //     throw new Error("Failed to fetch cards");
    // }
    // const data = await response.json();
    // return data.cards;

    // Mock data
    return [
        {slug: "ts-1", title: "Task 1", content: "Content 1", status: "todo", boardId: "1", dueDate: "2022-12-31", priority: "high"},
        {slug: "ts-2", title: "Task 2", content: "Content 2", status: "in-progress", boardId: "1"},
        {slug: "ts-3", title: "Task 3", content: "Content 3", status: "done", boardId: "1"},
        {slug: "ts-4", title: "Task 4", content: "Content 4", status: "todo", boardId: "1"},
        {slug: "ts-5", title: "Task 5", content: "Content 5", status: "in-progress", boardId: "1"},
        {slug: "ts-6", title: "Task 6", content: "Content 6", status: "done", boardId: "1"},
    ];
};

const BoardPage = async ({params,}: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const statuses = await fetchStatuses(id);
    const cards = await fetchCards(id);
    return (
        <div className="p-4"><Board id={id as string} statuses={statuses} cards={cards}/></div>

    );
};

export default BoardPage;
