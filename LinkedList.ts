class LLNode<T> {
    public prev?: LLNode<T>;
    public next?: LLNode<T>;

    constructor(public data: T){}
}

interface ILinkedList<T> {
    unshift(data: T): void;
    shift(): LLNode<T> | null;
    push(data: T): void;
    pop(): LLNode<T> | null;
    at(index: number): T;
    insertAt(index: number, data: T): void;
    removeAt(index: number): T;
    traverse(): T[];
    findMatches(comparator: (data: T) => boolean): T[];
    removeMatches(comparator: (data: T) => boolean): T[];
    clear(): void;
}

export class LinkedList<T> implements ILinkedList<T> {
    private _head?: LLNode<T>;
    private _tail?: LLNode<T>;
    private _length: number = 0;

    getLength(): number {
        return this._length;
    }

    unshift(data: T): void {
        const newNode = new LLNode<T>(data);

        newNode.next = this._head;
        // if list has nodes, point head back to new node,
        // otherwise set tail pointer on first node in list
        if (this._head) {
            this._head.prev = newNode;
        } else {
            this._tail = newNode;
        }

        this._head = newNode;
        this._length++;
    }

    shift(): LLNode<T> | null {
        if (!this._head) {
            return null;
        }

        const shiftedNode: LLNode<T> = this._head;
        this._head = this._head.next;
        // remove pointer to shifted node;
        // if last node was shifted, remove tail pointer
        if (this._head) {
            this._head.prev = undefined;
        } else {
            this._tail = undefined;
        }

        this._length--;
        return shiftedNode;
    }

    push(data: T): void {
        const newNode = new LLNode<T>(data);

        newNode.prev = this._tail;
        // if list has nodes, point tail forward to new node,
        // otherwise set head pointer on first node in list
        if (this._tail) {
            this._tail.next = newNode;
        } else {
            this._head = newNode;
        }

        this._tail = newNode;
        this._length++;
    }

    pop(): LLNode<T> | null {
        if (!this._tail) { return null; }

        const poppedNode: LLNode<T> = this._tail;
        this._tail = this._tail.prev;
        // remove pointer to popped node;
        // if last node was popped, remove head pointer
        if (this._tail) {
            this._tail.next = undefined;
        } else {
            this._head = undefined;
        }

        this._length--;
        return poppedNode;
    }

    at(index: number): T {
        return this.travelToNode(index).data;
    }

    insertAt(index: number, data: T): void {
        if (index === 0 || index === -this._length) {
            this.unshift(data);
        } else if (index === this._length) {
            this.push(data);
        } else {
            let current: LLNode<T> = this.travelToNode(index);

            const newNode = new LLNode<T>(data);

            newNode.prev = current.prev;
            newNode.prev!.next = newNode;
            newNode.next = current;
            newNode.next.prev = newNode;

            this._length++;
        }
    }

    removeAt(index: number): T {
        return this.removeNode(this.travelToNode(index)).data;
    }

    traverse(): T[] {
        if (this._length === 0) {
            return [];
        }

        const data: T[] = new Array(this._length);
        let index: number = 0;

        let current: LLNode<T> | undefined = this._head;
        while (current) {
            data[index++] = current.data;
            current = current.next;
        }

        return data;
    }

    findMatches(comparator: (data: T) => boolean): T[] {
        const nodeMatches: LLNode<T>[] = this.findNodeMatches(comparator);

        return nodeMatches.map((node: LLNode<T>): T => node.data);
    }

    removeMatches(comparator: (data: T) => boolean): T[] {
        const nodeMatches: LLNode<T>[] = this.findNodeMatches(comparator);

        return nodeMatches.map(
            (node: LLNode<T>): T => this.removeNode(node).data
        );
    }

    clear(): void {
        this._head = undefined;
        this._tail = undefined;
        this._length = 0;
    }

    private findNodeMatches(comparator: (data: T) => boolean): LLNode<T>[] {
        const nodeMatches: LLNode<T>[] = [];

        let current: LLNode<T> | undefined = this._head;
        while (current) {
            if (comparator(current.data)) {
                nodeMatches.push(current);
            }
            current = current.next;
        }

        return nodeMatches;
    }

    private travelToNode(index: number): LLNode<T> {
        if (index < 0) {
            index = this._length + index;
        }
        if (index < 0 || index >= this._length) {
            throw new RangeError(`Index ${index} is out of bounds.`);
        }

        let current: LLNode<T>;

        if (index < this._length / 2) {
            current = this._head!;
            for (let _: number = 0; _ < index; _++) {
                current = current.next!;
            }
        } else {
            current = this._tail!;
            for (let _: number = this._length - 1; _ > index ; _--) {
                current = current.prev!;
            }
        }

        return current;
    }

    private removeNode(node: LLNode<T>): LLNode<T> {
        // point previous node past current;
        // if no previous node, current is head, increment head
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this._head = node.next;
        }

        // point next node before current;
        // if no next node, current is tail, decrement tail
        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this._tail = node.prev;
        }

        node.prev = undefined;
        node.next = undefined;

        this._length--;

        return node;
    }
}