class BalanceError extends Error {
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
    }
}

export interface IBalanceNode {
    left?: IBalanceNode;
    right?: IBalanceNode;
    height: number;
}


export function balance<T extends IBalanceNode>(node: T): T {
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

function getHeight<T extends IBalanceNode>(node?: T): number {
    return node?.height ?? 0;
}

function getBalanceFactor<T extends IBalanceNode>(node?: T): number {
    return getHeight(node?.left) - getHeight(node?.right);
}

function update_height<T extends IBalanceNode>(node: T): void {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
}

function rotateRight<T extends IBalanceNode>(node: T): T {
    if (!node || !node.left) { throw new BalanceError("Invalid node for rotation."); }

    const newSubRoot: T = node.left as T;
    const subTreeToMove: T | undefined = newSubRoot.right as T | undefined;

    newSubRoot.right = node;
    node.left = subTreeToMove;

    update_height(node);
    update_height(newSubRoot);

    return newSubRoot;
}

function rotateLeft<T extends IBalanceNode>(node: T): T {
    if (!node || !node.right) { throw new BalanceError("Invalid node for rotation."); }

    const newSubRoot: T = node.right as T;
    const subTreeToMove: T | undefined = newSubRoot.left as T | undefined;

    newSubRoot.left = node;
    node.right = subTreeToMove;

    update_height(node);
    update_height(newSubRoot);

    return newSubRoot;
}