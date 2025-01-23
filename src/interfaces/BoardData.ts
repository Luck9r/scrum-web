import {TaskData} from "@/interfaces/TaskData";

export interface BoardData {
    id: string;
    title: string;
    tasks?: TaskData[];
}
