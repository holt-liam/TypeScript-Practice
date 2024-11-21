import { IBalanceNode, balance  } from "./BalanceUtils";

export enum TraverseOrder {
    PRE = "pre",
    IN = "in",
    POST = "post"
}

class BalanceNode<K extends string | number, V> implements IBalanceNode {
    public left?: BalanceNode<K, V>;
    public right?: BalanceNode<K, V>;
    public height: number = 1;

    constructor(public key: K, public value: V){}
}

interface IBinarySearchTree<K extends string | number, V> {
    insert(key: K, value: V): boolean;
    find(key: K): V | null;
    delete(key: K): boolean;
    remove(key: K): V | null;
    traverse(order: TraverseOrder): V[];
    printTree(indentString?: string): void;
    getSize(): number;
}

export class BinarySearchTreeAVL<K extends string | number, V> implements IBinarySearchTree<K, V> {
    private _root?: BalanceNode<K, V>;
    private _size: number = 0;

    /**
     * Returns the height of the AVL Tree.
     * @returns The height of the tree (1 node in tree is height = 1).
     */
    getHeight(): number { return this._root?.height ?? 0; }

    /**
     * Returns the number of nodes in the AVL Tree.
     * @returns The number of nodes in the tree.
     */
    getSize(): number { return this._size; }

    /**
     * Inserts a key-value pair into an AVL tree.
     * @param key The key of the node.
     * @param value The value to associate with the key.
     * @returns true if the key was inserted, false if the key already exists.
     */
    insert(key: K, value: V): boolean {
        const preInsertSize: number = this._size;
        this._root = this._insert(key, value, this._root);

        return this._size === preInsertSize + 1;
    }

    /**
     * Finds a value based on key in the AVL Tree.
     * @param key The key associated with the value.
     * @returns The value if found, null otherwise.
     */
    find(key: K): V | null {
        const foundNode: BalanceNode<K, V> | undefined =  this._find(key, this._root);

        return foundNode?.value ?? null;
    }

    /**
     * Removes a node from the AVL Tree, by key.
     * @param key The key of the node.
     * @returns true if the node was deleted, false if the key was not found.
     */
    delete(key: K): boolean {
        const preInsertSize: number = this._size;
        this._root = this._delete(key, this._root);

        return this._size === preInsertSize - 1;
    }

    /**
     * Finds the value associated with the key in the AVL Tree, then deletes its node.
     * @param key The key of the node.
     * @returns The value if found, null otherwise.
     */
    remove(key: K): V | null {
        const foundValue: V | null = this.find(key);

        if (foundValue) { this.delete(key); }

        return foundValue;
    }

    /**
     * Returns a an array of all values in the AVL Tree in traversal order.
     * @param order The order to traverse, using TraverseOrder enum.
     * @returns An array of all values, in traversal order.
     */
    traverse(order: TraverseOrder = TraverseOrder.IN): V[] {
        const values: V[] = [];
        this._traverse(order, values, this._root);

        return values;
    }

    /**
     * Prints the keys of the tree, indented to visual tree structure.
     * @param indentString The string to indent with ("\t" is default).
     */
    printTree(indentString: string = "\t"): void {
        this._printTree(indentString, 0, this._root);
    }

    private _insert(key: K, value: V, node?: BalanceNode<K, V>): BalanceNode<K, V> {
        if (!node) {
            this._size++;
            return new BalanceNode<K, V>(key, value);
        }
        if (key < node.key) { node.left = this._insert(key, value, node.left);}
        else if (key > node.key) { node.right = this._insert(key, value, node.right); }
        else { return node; }

        return balance(node);
    }

    private _find(key: K, node?: BalanceNode<K, V>): BalanceNode<K, V> | undefined {
        if (!node) { return; }

        if (key < node.key) { return this._find(key, node.left); }
        else if (key > node.key) { return this._find(key, node.right); }
        else { return node; }
    }

    private _delete(key: K, node?: BalanceNode<K, V>): BalanceNode<K, V> | undefined {
        if (!node) { return; }

        if (key < node.key) { node.left = this._delete(key, node.left); }
        else if (key > node.key) { node.right = this._delete(key, node.right);}
        else {
            if (node.left && node.right) {
                const successorNode: BalanceNode<K, V> = this._findMinNode(node.right);

                node.key = successorNode.key;
                node.value = successorNode.value;

                node.right = this._delete(successorNode.key, node.right);
            } else {
                node = node.left ?? node.right;
                this._size--;
            }
        }

        if (!node) { return node; }

        return balance(node);
    }

    private _traverse(order: TraverseOrder, values: V[], node?: BalanceNode<K, V>): void {
        if (!node) { return; }

        if (order === TraverseOrder.PRE) { values.push(node.value); }
        this._traverse(order, values, node.left);
        if (order === TraverseOrder.IN) { values.push(node.value); }
        this._traverse(order, values, node.right);
        if (order === TraverseOrder.POST) { values.push(node.value); }
    }

    private _printTree(indentString: string, indentLevel: number, node?: BalanceNode<K, V>): void {
        const fullIndentString: string = indentString.repeat(indentLevel);

        if (!node) {
            console.log(fullIndentString, "{ }");
            return;
        }

        this._printTree(indentString, indentLevel + 1, node.right);
        console.log(fullIndentString, node.key);
        this._printTree(indentString, indentLevel + 1, node.left);
    }

    private _findMinNode(node: BalanceNode<K, V>): BalanceNode<K, V> {
        while (node.left) { node = node.left; }

        return node;
    }
}