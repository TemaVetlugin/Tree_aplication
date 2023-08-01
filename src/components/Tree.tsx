import React, {useRef, useState} from 'react';
import ModalAdd from "./ModalAdd";

interface Node {
    id: number;
    name: string;
    children?: Node[];
}



const Tree: React.FC = () => {

    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const baseNodes: Node[] = [
        {
            id: 1,
            name: 'Базовый элемент 1',
            children: [
                {
                    id: 2,
                    name: 'Базовый элемент 2',
                    children: [
                        {
                            id: 3,
                            name: 'Базовый элемент 3',
                        },
                    ],
                },
            ],
        },
    ];


    const titleNodeRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const titleNodeEditRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState("");
    const [selectedNode, setSelectedNode] = useState(0);
    const [nodes, setNodes] = useState<Node[]>(baseNodes);

    const addChildNode = (nodes: Node[], parentId: number, newNode: Node): Node[] => {
        return nodes.map((node) => {
            if (node.id === parentId) {
                return {
                    ...node,
                    children: [...(node.children || []), newNode],
                };
            } else if (node.children) {
                return {
                    ...node,
                    children: addChildNode(node.children, parentId, newNode),
                };
            }
            return node;
        });
    };

    const getMaxId = (arr: Node[]): number => {
        let maxId = 0;
        arr.forEach((node) => {
            if (node.id > maxId) {
                maxId = node.id;
            }
            if (node.children) {
                const childMaxId = getMaxId(node.children);
                if (childMaxId > maxId) {
                    maxId = childMaxId;
                }
            }
        });
        return maxId;
    };

    function getNameById(id: number, nodes: Node[]): string | '' {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.id === id) {
                return node.name;
            } else if (node.children) {
                const result = getNameById(id, node.children);
                if (result !== null) {
                    return result;
                }
            }
        }
        return '';
    }
    const updateName = (nodes: Node[], id: number, newName: string) => {

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.id === id) {
                node.name = newName;
            } else if (node.children) {
                const result = updateName(node.children, id, newName);
            }
        }
    };

    const removeNode = (nodes: Node[], id: number): void => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.id === id) {
                if (node.children) {
                    for (const child of node.children) {
                        removeNode(nodes, child.id);
                    }
                }
                nodes.splice(i, 1);
                return;
            } else if (node.children) {
                removeNode(node.children, id);
            }
        }
    };

    const onSubmitAdd = (ev: any) => {
        ev.preventDefault();

        const newNode: Node = {
            id: getMaxId(nodes) + 1,
            name: titleNodeRef.current?.value || '',
        };

        if(selectedNode!==0) {
            const updatedNodes = addChildNode(nodes, selectedNode, newNode);
            setNodes(updatedNodes);
        }else{
            setNodes([...nodes, newNode]);
        }
        setShowModalAdd(false);
    }
    const onSubmitEdit = (ev: any) => {
        ev.preventDefault();
        const newNodes = [...nodes];
        updateName(newNodes, selectedNode, titleNodeEditRef.current?titleNodeEditRef.current.value:'')
        setNodes(newNodes);
        setShowModalEdit(false);
    }

    const onClickDelete = (ev: any) => {
        ev.preventDefault();
        const newNodes = [...nodes];
        removeNode(newNodes, selectedNode)
        setNodes(newNodes);
        setSelectedNode(0);
    }
    const onClickReset = (ev: any) => {
        ev.preventDefault();
        setNodes(baseNodes);
    }



    const renderTree = (nodes: Node[]) => {
        return (
            <ul>

                {nodes.map((node) => (
                    <li key={node.id}>
                        <label>
                            <input
                                type="radio"
                                value={node.id}
                                checked={selectedNode === node.id}
                                onChange={(event) => {
                                    const newId = +event.target.value;
                                    // console.log(newId);
                                    if (newId === selectedNode) {
                                        setSelectedNode(0);
                                    } else {
                                        setSelectedNode(newId);
                                    }
                                }}
                            />
                            {node.name}
                        </label>
                        {node.children && renderTree(node.children)}
                    </li>
                ))}
            </ul>
        );
    };

    const handleShowModalAdd = () => {
        setShowModalAdd(true);
    };

    const handleCloseModalAdd = () => {
        setShowModalAdd(false);
    };
    const handleShowModalEdit = () => {
        setShowModalEdit(true);
        setInputValue(getNameById(selectedNode, nodes) ?? "");
    };

    const handleCloseModalEdit = () => {
        setShowModalEdit(false);
    };

    return (
        <div className="tree">
            <div className="tree-header">Tree</div>
            <div className="tree-body">
            <ul>
            <li>
                <label>
                    <input
                        type="radio"
                        value='0'
                        checked={selectedNode === 0}
                        onChange={(event) => {
                            const newId = +event.target.value;
                            setSelectedNode(newId);
                        }}
                    />
                    Добавить Корневой элемент
                </label>
            </li>
            </ul>
            {renderTree(nodes)}
            </div>
            {/*<AddNode />*/}
            <div className="tree-footer">
                <button className="btn" onClick={handleShowModalAdd}>Add</button>
                <ModalAdd isOpen={showModalAdd} onClose={handleCloseModalAdd} nodes={nodes}>
                    <form className="form form-control w-100" onSubmit={onSubmitAdd}>
                        <div className="form-group m-3">
                            <input ref={titleNodeRef} type="text" className=" text-input form-control" placeholder="Название"></input>
                            <button className="btn" type="submit">Добавить</button>
                        </div>
                    </form>
                    <button className="btn" onClick={handleCloseModalAdd}>Close</button>
                </ModalAdd>
                <button className="btn" onClick={handleShowModalEdit} disabled={selectedNode===0}>Edit</button>
                <button className="btn" onClick={onClickDelete} disabled={selectedNode===0}>Delete</button>
                <button className="btn" onClick={onClickReset}>Reset</button>
                <ModalAdd isOpen={showModalEdit} onClose={handleCloseModalEdit} nodes={nodes}>
                    <form className="form form-control w-100" onSubmit={onSubmitEdit}>
                        <div className="form-group m-3">
                            <input ref={titleNodeEditRef} defaultValue={inputValue} type="text" className="text-input form-control" placeholder="Название"></input>
                            <button className="btn"  type="submit">Изменить</button>
                        </div>
                    </form>
                    <button className="btn" onClick={handleCloseModalEdit}>Close</button>
                </ModalAdd>
            </div>
        </div>
    );
};

export default Tree;