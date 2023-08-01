import React from "react";

interface Node {
    id: number;
    name: string;
    children?: Node[];
}

interface ModalAddProps {
    isOpen: boolean;
    onClose: () => void;
    nodes: Node[];
    children: React.ReactNode;
}

function ModalAdd({ isOpen, onClose, nodes, children }: ModalAddProps) {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>{children}

            </div>
        </div>
    );
}

export default ModalAdd;