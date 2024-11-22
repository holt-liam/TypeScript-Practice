class BalanceError extends Error {
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
    }
}

export type BstKeyType = string | number;

export interface IBstNode<K extends BstKeyType> {
    key: K;
    left?: IBstNode<K>;
    right?: IBstNode<K>;
}

export interface IBstHeightNode<K extends BstKeyType> extends IBstNode<K> {
    height: number;
    left?: IBstHeightNode<K>;
    right?: IBstHeightNode<K>;
}

export function balance<K extends BstKeyType, T extends IBstHeightNode<K>>(
    node: T
): T {
    update_height(node);

    const balanceFactor: number = getBalanceFactor(node);

    if (balanceFactor > 1 && node.left && getBalanceFactor(node.left) >= 0) {
        return rotateRightHeight(node);
    }
    if (balanceFactor > 1 && node.left && getBalanceFactor(node.left) < 0) {
        node.left = rotateLeftHeight(node.left);
        return rotateRightHeight(node);
    }
    if (balanceFactor < -1 && node.right && getBalanceFactor(node.right) <= 0) {
        return rotateLeftHeight(node);
    }
    if (balanceFactor < -1 && node.right && getBalanceFactor(node.right) > 0) {
        node.right = rotateRightHeight(node.right);
        return rotateLeftHeight(node);
    }

    return node;
}

export function splay<K extends BstKeyType, T extends IBstNode<K>>(
    key: K, node?: T
): T | undefined {
    if (!node || node.key === key) { return node; }

    if (key < node.key) {
        if (!node.left) { return node; }

        if (key < node.left.key) {
            node.left.left = splay(key, node.left.left);
            node = rotateRight(node);
        } else if (key > node.left.key) {
            node.left.right = splay(key, node.left.right);
            if (node.left.right) { node.left = rotateLeft(node.left); }
        }

        return (node.left) ? rotateRight(node) : node.left;
    }
    else {
        if (!node.right) { return node; }

        if (key < node.right.key) {
            node.right.left = splay(key, node.right.left);
            if (node.right.left) { node.right = rotateRight(node.right); }
        }
        else if (key > node.right.key) {
            node.right.right = splay(key, node.right.right);
            node = rotateLeft(node);
        }

        return (node.right) ? rotateLeft(node) : node.right;
    }
}

export function update_height<K extends BstKeyType, T extends IBstHeightNode<K>>(
    node: T
): void {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
}

function getHeight<K extends BstKeyType, T extends IBstHeightNode<K>>(
    node?: T
): number { return node?.height ?? 0; }

function getBalanceFactor<K extends BstKeyType, T extends IBstHeightNode<K>>(
    node?: T
): number { return getHeight(node?.left) - getHeight(node?.right); }

function rotateRight<K extends BstKeyType, T extends IBstNode<K>>(
    node: T
): T {
    if (!node || !node.left)
    { throw new BalanceError("Invalid node for rotation."); }

    const newSubRoot: T = node.left as T;

    node.left = newSubRoot.right;
    newSubRoot.right = node;

    return newSubRoot;
}

function rotateRightHeight<K extends BstKeyType, T extends IBstHeightNode<K>>(
    node: T
): T {
    const newSubRoot: T = rotateRight(node);

    update_height(node);
    update_height(newSubRoot)

    return newSubRoot;
}

function rotateLeft<K extends BstKeyType, T extends IBstNode<K>>(
    node: T
): T {
    if (!node || !node.right)
    { throw new BalanceError("Invalid node for rotation."); }

    const newSubRoot: T = node.right as T;

    node.right = newSubRoot.left;
    newSubRoot.left = node;

    return newSubRoot;
}

function rotateLeftHeight<K extends BstKeyType, T extends IBstHeightNode<K>>(
    node: T
): T {
    const newSubRoot: T = rotateLeft(node);

    update_height(node);
    update_height(newSubRoot);

    return newSubRoot;
}