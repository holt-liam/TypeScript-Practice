class BalanceError extends Error {
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
    }
}

export type KeyType = string | number;

export interface IBalanceNode<K extends KeyType> {
    key: K;
    left?: IBalanceNode<K>;
    right?: IBalanceNode<K>;
    height: number;
}

export function balance<K extends KeyType, T extends IBalanceNode<K>>(
    node: T
): T {
    update_height(node);

    const balanceFactor: number = getBalanceFactor(node);

    if (balanceFactor > 1 && getBalanceFactor(node.left) >= 0) {
        return rotateRight(node);
    }
    if (balanceFactor > 1 && getBalanceFactor(node.left) < 0) {
        node.left = rotateLeft(node.left!);
        return rotateRight(node);
    }
    if (balanceFactor < -1 && getBalanceFactor(node.right) <= 0) {
        return rotateLeft(node);
    }
    if (balanceFactor < -1 && getBalanceFactor(node.right) > 0) {
        node.right = rotateRight(node.right!);
        return rotateLeft(node);
    }

    return node;
}

export function splay<K extends KeyType, T extends IBalanceNode<K>>(
    key: K, node?: T
): T | undefined {
    if (!node || node.key === key) { return node; }

    return node;
}

function getHeight<K extends KeyType, T extends IBalanceNode<K>>(
    node?: T
): number { return node?.height ?? 0; }

function getBalanceFactor<K extends KeyType, T extends IBalanceNode<K>>(
    node?: T
): number { return getHeight(node?.left) - getHeight(node?.right); }

function update_height<K extends KeyType, T extends IBalanceNode<K>>(
    node: T
): void {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
}

function rotateRight<K extends KeyType, T extends IBalanceNode<K>>(
    node: T
): T {
    if (!node || !node.left)
        { throw new BalanceError("Invalid node for rotation."); }

    const newSubRoot: T = node.left as T;

    node.left = newSubRoot.right;
    newSubRoot.right = node;

    update_height(node);
    update_height(newSubRoot);

    return newSubRoot;
}

function rotateLeft<K extends KeyType, T extends IBalanceNode<K>>(
    node: T
): T {
    if (!node || !node.right)
        { throw new BalanceError("Invalid node for rotation."); }

    const newSubRoot: T = node.right as T;

    node.right = newSubRoot.left;
    newSubRoot.left = node;

    update_height(node);
    update_height(newSubRoot);

    return newSubRoot;
}