import React, { ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableProps {
    id: string;
    children: ReactNode;
}

const Draggable: React.FC<DraggableProps> = ({ id, children }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes}>
            {children}
        </div>
    );
};

export default Draggable;
