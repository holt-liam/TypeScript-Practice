import { BstKeyType, IBstNode, splay } from "./BalanceUtils";

class SplayNode<K extends BstKeyType, V> implements IBstNode<K> {
    left?: SplayNode<K, V>;
    right?: SplayNode<K, V>;

    constructor(public key: K, public value: V) {}
}

interface ISplayTree<K extends BstKeyType, V> {
    insert(key: K, value: V): boolean;
    find(key: K): V | null;
    remove(key: K): V | null;
}

export class SplayTree<K extends BstKeyType, V> implements ISplayTree<K, V> {
    private _root?: SplayNode<K, V>;
    private _size: number = 0;

    getSize(): number {
        return this._size;
    }

    insert(key: K, value: V): boolean {
        if (!this._root) {
            this._root = new SplayNode<K, V>(key, value);
            this._size++;

            return true;
        }
        const currentRoot: SplayNode<K, V> = splay(key, this._root)!;

        if (key === currentRoot.key) {
            return false;
        } else if (key < currentRoot.key) {
            const newRoot: SplayNode<K, V> = new SplayNode<K, V>(key, value);

            newRoot.right = currentRoot;
            newRoot.left = currentRoot.left;
            currentRoot.left = undefined;

            return true;
        } else {
            const newRoot: SplayNode<K, V> = new SplayNode<K, V>(key, value)!;

            newRoot.left = currentRoot;
            newRoot.right = currentRoot.right;
            currentRoot.right = undefined;

            return true;
        }
    }

    find(key: K): V | null {
        return splay(key, this._root)?.value ?? null;
    }

    remove(key: K): V | null {
        if (!this._root) {
            return null;
        }

        const currentRoot: SplayNode<K, V> = splay(key, this._root)!;

        if (key !== currentRoot.key) {
            this._root = currentRoot;
            return null;
        }

        if (!currentRoot.left) { this._root = currentRoot.right; }
        else {
            this._root = splay(key, currentRoot.left)!;
            this._root.right = currentRoot.right;
        }

        return currentRoot.value;
    }
}