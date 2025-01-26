import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
    id: string;
    statusId: string;
    children: ReactNode;
}

const Droppable: React.FC<DroppableProps> = ({ id, statusId, children }) => {
    const { setNodeRef } = useDroppable({ id, data: { statusId } });

    return (
        <div ref={setNodeRef}>
            {children}
        </div>
    );
};

export default Droppable;
