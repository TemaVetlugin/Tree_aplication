import React, { createContext, useState } from 'react';

interface Node {
    id: number;
    name: string;
    children?: Node[];
}

type NodesContextType = {
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
};

export const NodesContext = createContext<NodesContextType>({} as NodesContextType);

export const NodesProvider: React.FC = ({ children }: { children?: React.ReactNode }) => {
    const [nodes, setNodes] = useState<Node[]>([
        {
            id: 1,
            name: 'Element 1',
            children: [
                {
                    id: 2,
                    name: 'Element 1.1',
                    children: [
                        {
                            id: 3,
                            name: 'Element 1.1.1',
                        },
                        {
                            id: 4,
                            name: 'Element 1.1.2',
                        },
                    ],
                },
                {
                    id: 5,
                    name: 'Element 1.2',
                },
            ],
        },
    ]);

    return <NodesContext.Provider value={{ nodes, setNodes }}>{children}</NodesContext.Provider>;
};


