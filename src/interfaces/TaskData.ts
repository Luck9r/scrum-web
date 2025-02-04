export interface TaskData {
    id: string;
    slug: string;
    title: string;
    content?: string;
    dueDate?: string;
    priority?: string;
    priorityId?: string;
    status: string;
    statusId: string;
    boardId: string;
    assigneeId?: string;
    creatorId: string;
    assigneeName?: string;
    creatorName: string;

}
