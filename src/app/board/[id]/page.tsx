import Board from "@/ui/Board";
import {CardData} from "@/interfaces/CardData";


const fetchStatuses = async (id: string): Promise<string[]> => {
    // const response = await fetch(`https://api.example.com/boards/${id}/statuses`);
    // if (!response.ok) {
    //     throw new Error("Failed to fetch statuses");
    // }
    // const data = await response.json();
    // return data.statuses;

    // Mock data
    return ["todo", "in-progress", "done"];
};

const fetchCards = async (id: string): Promise<CardData[]> => {
    // const response = await fetch(`https://api.example.com/boards/${id}/cards`);
    // if (!response.ok) {
    //     throw new Error("Failed to fetch cards");
    // }
    // const data = await response.json();
    // return data.cards;

    // Mock data
    return [
        {slug: "ts-1", title: "Task 1", content: "Content 1", status: "todo"},
        {slug: "ts-2", title: "Task 2", content: "Content 2", status: "in-progress"},
        {slug: "ts-3", title: "Task 3", content: "Content 3", status: "done"},
        {slug: "ts-4", title: "Task 4", content: "Content 4", status: "todo"},
        {slug: "ts-5", title: "Task 5", content: "Content 5", status: "in-progress"},
        {slug: "ts-6", title: "Task 6", content: "Content 6", status: "done"},
    ];
};

const BoardPage = async ({params,}: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const statuses = await fetchStatuses(id);
    const cards = await fetchCards(id);
    return (
        <div className="bg-base-200 h-screen">
            <main className="p-10">
                <Board id={id as string} statuses={statuses} cards={cards}/>
            </main>
            <footer className="">
            </footer>
        </div>
    );
};

export default BoardPage;
